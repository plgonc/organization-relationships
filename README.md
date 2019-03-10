# Organization Relationships

RESTful web service to store organization relationships.
This service is developed using NodeJS and backed up by a MySQL database.

## API

### POST /api/relations
This endpoint will accept organizations relationships definition as a single JSON object. The service will create and store them.
Example:
```
{
    "org_name": "beta",
    "daughters": [
        {
            "org_name": "alfa",
            "daughters": [
                {
                    "org_name": "gama"
                },
                {
                    "org_name": "delta"
                },
                {
                    "org_name": "evian",
                    "daughters": [
                        {
                            "org_name": "charlie"
                        }
                    ]
                }
            ]
        }
    ]
}
```
  

### GET /api/relations/:org_name
This endpoint will return all the relations for a given organization, ordered by name.
Response for org_name "evian" in Post example:
```
[
	{
        "org_name": "alfa",
        "relationship_type": "parent"
    },
    {
        "org_name": "charlie",
        "relationship_type": "daughter"
    },
    {
        "org_name": "delta",
        "relationship_type": "sister"
    },
    {
        "org_name": "gama",
        "relationship_type": "sister"
    }
]
```
This endpoint also supports pagination (query parameters "page" and "page_size" need to be passed).
Example:
```
/api/relations/evian?page=1&page_size=2
```
## Execution
### Setup and run
To run the service locally, install MySQL, create a new database called "organizations" and run the 'init.sql' file in project root directory. This will handle all the necessary work related to database creation and setup.
Open a command line in project root directory and execute the following command to start the service:
```
npm run start
```
This will expose the API in port 3000. It can be tested using Postman and the collection provided (OrganizationsRelations.postman.json file).
Alternatively you can use docker-compose to run both containers with database and application.
### Using docker-compose
The docker-compose file have two containers definition: 'db' and 'app'. To simplify the setup of the application, docker-compose can be used to run only a MySQL database instance (avoiding the need to install it and run the init file). This can be done with the command:
```
docker-compose up db
```
The application can also run inside a container.
To run both database instance and application in docker, the following command is enough:
```
docker-compose up
```
### Unit Tests
There are unit tests covering the implementation of this service. 
The following command is responsible for running them and produce a report:
```
npm run test
```