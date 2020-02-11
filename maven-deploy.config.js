const config = {
    "groupId"      : "space.waltz-controls",    // required - the Maven group id.
    "artifactId"   : "eventbus",         // the Maven artifact id.
    "buildDir"     : "dist",           // project build directory.
    "finalName"    : "{name}",         // the final name of the file created when the built project is packaged.
    "type"         : "war",            // type of package. "war" or "jar" supported.
    "fileEncoding" : "utf-8",           // file encoding when traversing the file system, default is UTF-8
    // "repositories" : [                 // array of repositories, each with id and url to a Maven repository.
    //     {
    //         "id": "example-internal-snapshot",
    //         "url": "http://mavenproxy.example.com/example-internal-snapshot/"
    //     },
    //     {
    //         "id": "example-internal-release",
    //         "url": "http://mavenproxy.example.com/example-internal-release/"
    //     }
    // ]
};


const maven = require('maven-deploy');
maven.config(config);
maven.package();