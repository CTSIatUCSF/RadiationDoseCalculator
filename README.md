# Radiation Dose Calculator
![Circle CI](https://circleci.com/gh/CranestyleLabs/RadiationDoseCalculator.png?circle-token=c352826043e69c5309b91e489d06f0a16e4b7392)

## Installation Instructions

### Simple Install

The `/public` folder contains all of the files needed to run the calculator. Just follow these steps:  

1. Open `/public/index.html`. You'll see comments indicating where you can place a custom header and footer. 
2. You'll also see comments indicating where you can change the application's color scheme. Three color schemes are included in the `/public/css/` folder. Simply change the href to point at the color scheme you want to use.
3. When you are done editing `/public/index.html`, save your changes.
4. You can replace `/public/favicon.ico` with an image of your choice. If you change the image, make sure you name your image **favicon.ico**
5. Copy all files in the `/public` folder to your web server and start it up.
6. Go to [your-server-name/#/json-editor] (http://your-server-name/#/json-editor) to edit the consent narrative and add, remove, and modify procedure data. This page will allow you to generate a new `data.json` file, but it will not update the data on your web server. You'll need to replace the existing `/public/js/data/data.json` file with your version of the file. 

###### Notes about Consent Narrative
When editing the consent narrative, there are tags wrapped in **<<>>** that get replaced with various settings or calculated values when they are displayed to the end user:

Tag | Description
--- | -----------
`<<effectiveDose>>` | Calculated value based on data entered by the user.  See **Effective Dose Type** below for more details.
`<<comparisonDoseUnit>>` | See **Comparison Dose Unit** below.  
`<<comparisonDoseQuotient>>` | Calculated value (effective dose / comparison dose). Indicates the number of comparison doses.
`<<comparisonDose>>` | See **Comparison Dose** below.

There are also a few data entry fields that feed into the consent narrative:

Field | Description
----- | -----------
Comparison Dose | Numeric value. Indicates the comparison dose to display in the `<<comparisonDose>>` tag in the consent narrative.
Comparison Dose Unit | Indicates which unit (**rem** or **mSv**) to use for the `<<effectiveDose>>` and `<<comparisonDose>>` in the consent narrative. **Note**: Reports produced by the application always show their data in mSv. This value only applies to the consent narrative.
Effective Dose Type | Determines how the effective dose is calculated. Selecting **Total** will show the total of all procedures entered into the calculator, regardless of whether they are marked as "standard of care." Selecting **Research** will exclude procedures marked as "standard of care" from the calculation.

### Node.js Install

If you want to use Node.js as your web server, follow steps 1-4 of the **Simple Install** instructions above, then complete the following steps:

1. Copy the `/node` folder to the same location you copied the `/public` folder.
2. Using the command line, navigate into the `/node` folder.
3. If you want to change the port number, you can edit it on line 10 of **server.js**.
4. Run `npm install` to install the project's dependencies.
5. Run `node server.js` to start the node server.

### Advanced Install / Rebuilding the Project

If you want to edit any of the javascript files or create your own css color scheme, it is best to make your changes in the `/app` folder and rebuild the project.  This requires that you have the [grunt command line interface] (https://github.com/gruntjs/grunt-cli) installed on your machine.

1. **WARNING!:** If you have already edited any of the files in the `/public` folder, you'll want to copy your changes into the `/app` folder. Otherwise, Step 2 will overwrite the `/public` folder and wipe out your changes.
2. From the `/node` folder, run `grunt`. This will rebuild the application and replace the files in the `public` folder.
3. Follow the **Simple Install** or **Node.js Install** instructions to complete the installation

#####Changing the json-editor URL:#####

The default json editor is located at `/#/json-editor`. To change this URL:  
1. Open `app/app.js`.  
2. Look for the line that reads `url: "/json-editor"`.  
3. Change `json-editor` to the desired URL and save file.  
4. From the `/node` folder, run `grunt`. This will rebuild the application and replace the files in the `public` folder.
