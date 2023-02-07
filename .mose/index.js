const process = require("process");
const path = require("path");
const os = require('os');
const fs = require("fs");
const folders = require("platform-folders")

//require the ffmpeg package so we can use ffmpeg using JS
const ffmpeg = require('fluent-ffmpeg');

//Get the paths to the packaged versions of the binaries we want to use
const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static');

//tell the ffmpeg package where it can find the needed binaries.
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

//
// Save a reference to the local folder holding JWVT
// if this Folder doesnt exist it needs to be generated and MOSE needs to be restarted.
const mainDirectory = path.join(folders.getDocumentsFolder(), '@JWVT');

/**
 *
 * @MoseTools
 * ----------------------------------------
 * Loop through arguments passed to program
 * - Arguments Length should be greater than one
 *
 */

try {

    if(process.argv.length > 2) {

        // Valid extensions
        let validExtensions = ['mov', 'mp4'];

        // Get first item in array
        let fileToConvert = process.argv[2];
        let parsedExtension = fileToConvert.split(".")

        // Make sure there is a valid extension provided
        if(parsedExtension.length > 1) {

            // Get Extension
            let extension = parsedExtension[(parsedExtension.length - 1)]

            if(validExtensions.includes(extension)) {

                /**
                 * At this point the file is clean and ready to be used
                 * The purpose of this application is to convert a video file to audio.
                 *
                 * FFPMEG is the main component in this process once we grab the file using the node Filesystem
                 *
                 */

                const videoLocation = path.join(mainDirectory, 'videos', fileToConvert)
                const toSaveAudioLocation = path.join(mainDirectory, 'audio', fileToConvert.replace(extension, 'mp3'))

                // Start Process of converting file
                ffmpeg(videoLocation)
                    .toFormat("mp3")
                    .saveToFile(toSaveAudioLocation, (stdout, stderr) => {})
                    .on('error', (err) => { throw(err) })
                    .on('end', () => console.log(`200: Completed Task @ ${toSaveAudioLocation}`))
                    .run()

            } else { throw("102: The file provided is not supported at this time.") }

        } else { throw("101: The file referenced is not acceptable, please try again."); }


    } else { throw("100: There were no arguments provided"); }

} catch (err) { console.log(err) };
