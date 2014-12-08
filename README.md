# Radiation Dose Calculator
![Circle CI](https://circleci.com/gh/CranestyleLabs/RadiationDoseCalculator.png?circle-token=c352826043e69c5309b91e489d06f0a16e4b7392)

## Installation Instructions

### Simple Install

The **public** folder contains all of the files needed to run the calculator. Just follow these steps:  

1. Open **/public/js/data.json** and edit the following values:
	* ConsentNarrative  
	* ComparisonDoseSupportingLanguage  
	* ComparisonDose    
2. Open **/public/index.html**. You'll see comments indicating where you can place a custom header and footer. Save your changes.
3. You can replace **/public/favicon.ico** with an image of your choice. If you change the image, make sure you name your image **favicon.ico**
4. TODO: color palette configuration
5. Copy all files in the **/public** folder to your web server and start it up.

### Node.js Install

If you want to use Node.js as your web server, follow steps 1-4 of the **Simple Install** instructions above, then complete the following steps:

1. Copy the **/node** folder to the same location you copied the **/public** folder.
2. Using the command line, navigate into the **/node** folder.
3. If you want to change the port number, you can edit it on line 10 of **server.js**.
4. Run **npm install** to install the project's dependencies.
5. Run **node server.js** to start the node server.

### Advanced Install / Rebuilding the Project

If you want to edit any of the javascript files, it is best to make your changes in the **/app** folder and rebuild the project.  This requires that you have the [grunt command line interface] (https://github.com/gruntjs/grunt-cli) installed on your machine.

1. **WARNING!:** If you have already edited any of the files in the **/public** folder, you'll want to copy your changes into the **/app** folder. Otherwise, Step 2 will overwrite the **/public** folder and wipe out your changes.
2. From the **/node** folder, run **grunt deploy**. This will rebuild the application and replace the files in the **/public** folder.
3. Follow the **Simple Install** or **Node.js Install** instructions to complete the installation  
