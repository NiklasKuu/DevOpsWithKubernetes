### Exercise 3.06: DBaaS vs DIY
- It's easier to keep the maintain the DBaas comared to the DIY solution as the database provider handles keeping the database up to date.
- It's easier to scale out DIY solutions, as creating more databases can be done very easily in kubernetes.
- It looks like the pricing is cheaoer per GB wise, when using the DIY solution.
- Restricting the network access to the db seems easier in the DIY solution as by default access is only given to pods in the cluster.
- setting up backups is probably easier with the DBaas, as many services provide that as an option