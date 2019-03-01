# RSS mentor dashboard
Hosting: [Mentor dashboard](https://f8b23lef.github.io/mentor-dashboard/ "https://f8b23lef.github.io/mentor-dashboard/")

## Install Dependencies
`npm install`

## Build project
`npm run build`

## Run dev server
`npm run start`

## Run tests
`npm run test`

## Run lint
`npm run lint`

### Instruction:
1. Download Tasks.xlsx, Mentor score.xlsx, Mentor-students pairs.xlsx from  [google drive folder](https://drive.google.com/drive/folders/1ULj8KjnNNCgUdGunQ1TY00dNbCsqAsHW)
2. Put files from (1) in the folder ./src/jsonGenerator/resources/
3. Run `npm run generate-json` to generate json from *.xlsx files
4. Run `npm run publish` to update data.json file on gh-pages
5. Run `npm run start` or open [https://f8b23lef.github.io/mentor-dashboard/](https://f8b23lef.github.io/mentor-dashboard/) to see the result

### Note:
- In the file "Mentor score.xlsx" in the column B and row 1338 I added the github nick (Shutya) after https://github.com/