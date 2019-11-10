var cmd = require('node-cmd');
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');
//In this project I have several things that I need to do.

//First, there needs to be a timer that runs for say 5 seconds.

//It will run the macro (probably using node-cmd).
//That macro must end by calling a second piece of functionality that 
//does the following.
var tempStagingFolderPath;
if (process.argv[2]) {
    tempStagingFolderPath = process.argv[2];
} else {
tempStagingFolderPath = "/home/nmcc/Documents/demoStagingFolders";

}
var keyFileStore = "/home/nmcc/Documents/THPoject/My First Project-343d9314fb38.json";
//It must take the temp directory that we work with.
var b = true;

//And save everything from it to google cloud through the api.

//This is important hard functionality.))))))...
//Given a shared Int32Array:
var refreshId = setInterval(() => {
    //This function will run my UiPath Batch File
    cmd.get('ps s a', function (err, data, stderr) {
        //If there is an error, I will stop.

        if (!JSON.stringify(data).includes('gimp')) {
            clearImmediate(refreshId);
            console.log("Terminating: Gimp is closing too.")
        } else {
            if (err) throw err;
            //Set the Variable Constants for the Demo
            var bucketName = "tigerhacks2019";
            var directoryPath = tempStagingFolderPath;

            //This is the first function, which Calls the initial case.
            async function uploadDirectory() {
                // Creates a Storage Client
                const storage = new Storage({
                    keyFilename: "/home/nmcc/Documents/THPoject/My First Project-343d9314fb38.json",
                    projectId: "proud-processor-258600"
                });
                //Creates the list of files so that it is new every time. 
                let fileList = [];
                // get the list of files from the specified directory

                let dirCtr = 1;
                let itemCtr = 0;
                const pathDirName = path.dirname(directoryPath);
                //Recursively get all files.
                getFiles(directoryPath);

                function getFiles(directory) {
                    fs.readdir(directory, (err, items) => {
                        dirCtr--;
                        itemCtr += items.length;
                        items.forEach(item => {
                            const fullPath = path.join(directory, item);
                            fs.stat(fullPath, (err, stat) => {
                                itemCtr--;
                                if (stat.isFile()) {
                                    if (Date.now() - stat.mtime.getTime() < 10000 || b) {

                                        fileList.push(fullPath);
                                    }
                                } else if (stat.isDirectory()) {
                                    dirCtr++;
                                    getFiles(fullPath);
                                }

                                if (dirCtr === 0 && itemCtr === 0 && fileList.length != 0) {
                                    onComplete();
                                }
                                b = false;
                            });
                        });
                    });
                }

                async function onComplete() {
                    const resp = await Promise.all(
                        fileList.map(filePath => {
                            let destination = path.relative(pathDirName, filePath);
                            // If running on Windows
                            if (process.platform === 'win32') {
                                destination = destination.replace(/\\/g, '/');
                            }
                            return storage
                                .bucket(bucketName)
                                .upload(filePath, { destination })
                                .then(
                                    uploadResp => ({ fileName: destination, status: uploadResp[0] }),
                                    err => ({ fileName: destination, response: err })
                                );
                        })
                    );

                    const successfulUploads =
                        fileList.length - resp.filter(r => r.status instanceof Error).length;
                    console.log(
                        `${successfulUploads} files uploaded to ${bucketName} successfully.`
                    );
                }
            }

            uploadDirectory();
            // [END upload_directory]

            // This is where I run the functionality for SVGFEFuncAElement.
        }
    })

}, 10000)