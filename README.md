# meteor_app

### fits tables --> Meteor's mongo db
Cori
* `/global/cscratch1/sd/kaylanb/test/fits2db/fits2db_cori --csv -o c4d_170327_042342_oki_r_v1-star.csv /global/cscratch1/sd/kaylanb/dr5_zpts/decam/DECam_CP/CP20170326/c4d_170327_042342_oki_r_v1-star.fits` 

Laptop
* `mongoimport -h localhost:3001 --db meteor --collection star --type csv --file ~/Downloads/c4d_170327_042342_oki_r_v1-star.csv --headerline`
