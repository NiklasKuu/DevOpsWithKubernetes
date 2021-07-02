const k8s = require('@kubernetes/client-node')
const request = require('request')
const kc = new k8s.KubeConfig();
const fs = require('fs').promises;
const JSONStream = require('json-stream');
const mustache = require('mustache');


process.env.NODE_ENV === 'development' ? kc.loadFromDefault() : kc.loadFromCluster()

const opts = {}
kc.applyToRequest(opts)


const client = kc.makeApiClient(k8s.CoreV1Api);

const sendRequestToApi = async (api, method = 'get', options = {}) => new Promise((resolve, reject) => request[method](`${kc.getCurrentCluster().server}${api}`, {...opts, ...options, headers: { ...options.headers, ...opts.headers }}, (err, res) => err ? reject(err) : resolve(JSON.parse(res.body))))

const fieldsFromDummySite = (object) => ({
    dummysite_name: object.metadata.name,
    container_name: object.metadata.name,
    deployment_name: `${object.metadata.name}-dep`,
    service_name: `${object.metadata.name}-scv`,
    ingress_name: `${object.metadata.name}-ingress`,
    namespace: object.metadata.namespace,
    website_url: object.spec.website_url
})

const getDeploymentYaml = async (fields) => {
    const deploymentTemplate = await fs.readFile('deployment.mustache', 'utf-8');
    return mustache.render(deploymentTemplate, fields);
}
const getServiceYaml = async (fields) => {
    const serviceTemplate = await fs.readFile('service.mustache', 'utf-8');
    return mustache.render(serviceTemplate, fields);
}
const getIngressYaml = async (fields) => {
    const ingressTemplate = await fs.readFile('ingress.mustache', 'utf-8');
    return mustache.render(ingressTemplate, fields);
}

const createDeployment = async (fields) => {
    console.log('Creating deployment', fields.dummysite_name, 'for url', fields.website_url, 'to namespace', fields.namespace)

    const deploymentYaml = await getDeploymentYaml(fields);
    const serviceYaml = await getServiceYaml(fields);
    const ingressYaml = await getIngressYaml(fields);
    console.log('rendered yaml')
    console.log(deploymentYaml)
    console.log(serviceYaml)
    console.log(ingressYaml)
    const apiRequestsResponses = {
        deploymentRes: sendRequestToApi(`/apis/apps/v1/namespaces/${fields.namespace}/deployments`, 'post', {
            headers: {
                'Content-Type': 'application/yaml'
            },
            body: deploymentYaml
        }),
        serviceRes: sendRequestToApi(`/api/v1/namespaces/${fields.namespace}/services`,'post',{
            headers: {
                'Content-Type': 'application/yaml'
            },
            body: serviceYaml
        }),
        ingressRes: sendRequestToApi(`/apis/networking.k8s.io/v1beta1/namespaces/${fields.namespace}/ingresses`, 'post', {
            headers: {
                'Content-Type': 'application/yaml'
            },
            body: ingressYaml
        })
    }
    console.log('creating all resources');
    await Promise.all([apiRequestsResponses.deploymentRes, apiRequestsResponses.serviceRes, apiRequestsResponses.ingressRes]);
    console.log('all resources created');
    console.log(apiRequestsResponses);
    return apiRequestsResponses;
}

const maintainStatus = async () => {
    (await client.listPodForAllNamespaces()).body
    console.log('starting maintain status');

    const dataStream = new JSONStream();
    dataStream.on('data', async (data) => {
        const fields = fieldsFromDummySite(data.object);

        if (data.type === 'ADDED') {
            createDeployment(fields);
        
        }
        
    });

    request.get(`${kc.getCurrentCluster().server}/apis/stable.dwk/v1/dummysites?watch=true`, opts).pipe(dataStream);
}

maintainStatus();