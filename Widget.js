//Variables initialized parts--------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Define xixi for btn controlling.
var xixi = 1;
//Got Dom element of related fields part.
var haha = document.getElementsByClassName("9999");
//Define config object.
var config = "";     //??var featureLayer = "";

//Function Definition parts-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Using for control visibility of Main fields
function getMainFieldsDisplay(result){
    if(config[result] == true){
        return "\"display:table-row\"";
    }else{
        return "\"display:none\"";
    }
}
//Using for control visibility of Related table fields
function getRelatedFieldsDisplay(result){
    if(config["Re_"+result] == true){
        return "\"display:table-row\"";
    }else{
        return "\"display:none\"";
    }
}
//Check whether the variable is number
function checkNumber(theObj) {
    var n = parseInt(theObj);
    if(!isNaN(n)){
        return true;
    }else{
        return n;
    }
}
//Construct getDate function. Means to convert date form Unix epoch to date/month/year
function getLocalTime(nS) {
    var date = new Date(nS);
    Y = date.getFullYear() + ', ';
    if(date.getMonth() < 9){
        M = '0'+((date.getMonth())+1)+'-';
    }else{
        M = date.getMonth()+1 + '-';
    }
    D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + '-';
    h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours())+ ':';
    m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':';
    s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds());
    return (D+M+Y+h+m+s);
}
//"Expand" button for map clicking part.
function btn1(a){
    console.log(a);
    //Clicking Expand, related records and attachments will display
    if(xixi%2==0){
        for(var y = 0;y<haha.length;y++){
            console.log("none");
            haha[y].style.display = "none";
        }
        xixi++;
    }else{
        for(var y = 0;y<haha.length;y++){
            console.log("display");
            haha[y].style.display = "inline";
        }
        xixi++;
    }
}
//"Expand" button for multiple selection part.
function btnSelection(a){
    console.log(a);
    //Clicking Expand, related records and attachments will display
    var haha = document.getElementsByClassName(a);
    console.log(haha);
    if(xixi%2==0){
        for(var y = 0;y<haha.length;y++){
            console.log("none");
            haha[y].style.display = "none";
        }
        xixi++;
    }else{
        for(var y = 0;y<haha.length;y++){
            console.log("display");
            haha[y].style.display = "inline";
        }
        xixi++;
    }
}
//Main implement in webAppBuilder----------------------------------------------------------------------------------------------------------------------------------------------------------------
define(['dojo/_base/lang',
        'dojo/_base/declare',
        'dojo/parser',
        'jimu/BaseWidget'
    ],
    function (lang, declare, parser,BaseWidget) {
        return declare([BaseWidget], {
            //templateString: template,
            baseClass: 'jimu-widget-simpledemo',
            name: 'SimpleDemo',
            postCreate: function () {
                this.inherited(arguments);
            },
            //Start setting area
            startup: function () {
                this.inherited(arguments);
                this.initLayout();
                this.parseXML();
            },
            parseXML :function () {
                console.log("haha");
            },
            //Doing some initialization work
            initLayout: function () {
                console.log("haha");
            },
            //Setting open function on this part
            onOpen: function () {
                //Displaying title from the input of configurable page.
                document.getElementById("title").innerText = this.config.contextMenu["Report_title"];
                //Just for testing, print all elements of config.contextMenu.
                console.log(this.config.contextMenu);
                //Store this.config.contextMenu using previous defined config.
                config = this.config.contextMenu;
                //Define layerUrl to store layerUrl
                var layerUrl = config["layer"];
                //Define relatedTableID to store this layer's related table's ID.
                var relatedTableID = config["relatedTableID"];
                //Define foreignKeyField to store this layer's foreign key.
                var foreignKeyField = config["foreignKeyField"];
                //Define foreignRelatedKeyField to store foreign key of this layer's related table.
                var foreignRelatedKeyField = config["foreignRelatedKeyField"];
                //Just for testing
                console.log(layerUrl);
                console.log(relatedTableID);
                console.log(foreignKeyField );
                console.log(foreignRelatedKeyField);
                //Define token for requesting data from rest page in next steps
                var service_token = config["Service_Token"];

//1st Function, clicking point and display data on panel. ---------------------------------------------------------------------------------------------------------------------------------------

                // register event on map
                this.map.on("click", function (event) {
                    //Initialize all of related fields part invisible.
                    for(var y = 0;y<haha.length;y++){
                        haha[y].style.display = "none";
                    }
                    //Initialize the xixi as 1 to confirm each time clicking a new point, "Expand" button will be reset.
                    xixi = 1;
                    //Implement getPoints function after clicking certain point
                    getPoints(event);

                });
                //Process responsive data
                function getPoints(response){
                    //For testing.
                    console.log(response);
                    //Return certain field's alias name.
                    function getFieldsAlias(a){
                        var temp_layerfields = response.graphic._layer.fields;
                        for(var i = 0;i<temp_layerfields.length;i++){
                            if(temp_layerfields[i].name == a){
                                return temp_layerfields[i].alias;
                            }
                        }
                    }
                    //Define value named invalid to store response's graphic value
                    var invalid = response.graphic;
                    //Define value named dt to store 'divShowResult' value
                    var dt = document.getElementById('divShowResult');
                    //If click map not point featurelayer
                    if(typeof(invalid) === 'undefined'){
                        //Setting the innerHTML to display on panel
                        dt.innerHTML = "<div>No Catchipit Points OR This layer isn't based on Feature Server</div>";
                    }else{
                        //define attr to store attributes of response
                        var attr = response.graphic.attributes;
                        //Output attr just for fun!!!! Just kidding, it's for testing. ahahahhahahhah. You can delete it if you want.
                        console.log(attr);
                        //Define temphtml to store panel's innerhtml.
                        var temphtml = "";
                        //Adding codes.
                        temphtml = "<table border=\"1\"><tr bgcolor=\"#C8C8C8\"><th><b>Fields Alias</b></th><th><b>Values</b></th></tr>";
                        for(var x in attr){
                            if(attr[x] !== null && checkNumber(attr[x]) == true && (attr[x].toString()).length == 13){
                                temphtml += "<tr style="+ getMainFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+getLocalTime(attr[x])+"</td></tr>";
                            }else{
                                if(attr[x] == null){
                                    temphtml += "<tr style="+ getMainFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+"</td></tr>";
                                }else{
                                    temphtml += "<tr style="+ getMainFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+attr[x]+"</td></tr>";
                                }
                            }
                        }
                        temphtml += "</table>";
                        //temphtml += "<a onclick=\"btn1("+ "9999" +")\" style=\"text-decoration:underline;color:blue\">Expand</a>";
                        //Assign temphtml to dt.innerHTML.
                        //dt.innerHTML = temphtml;
                        //Define fancy to store fancy(related part) dom element.
                        var fancy = document.getElementById('fancy');
                        //Define foreignKeyField_value to store layer's foreign key field.
                        var foreignKeyField_value = attr[foreignKeyField];
                        //Resuire queryTask and query
                        require(["esri/tasks/QueryTask", "esri/tasks/query", "dojo/domReady!"], function (QueryTask, Query) {
                            //Use layerUrl and relatedTableID to query from rest page.
                            var url = layerUrl+"/"+relatedTableID;
                            //Define queryTask and input related table link.
                            var queryTask = new QueryTask(url);
                            //Define query variable.
                            var query = new Query();
                            //No geometry return.
                            query.returnGeometry = false;
                            //Set all fields
                            query.outFields = ["*"];
                            //Define sql codes.
                            var sql = foreignRelatedKeyField+"=" + "\'" + foreignKeyField_value + "\'" + "";
                            query.where = sql;
                            //When resolved, returns features and graphics that satisfy the query.
                            queryTask.execute(query).then(function (results) {
                                //Define an object to store result's features
                                var feature = results.features;
                                //Define the content which will dynamically display on the bottom of page
                                console.log(feature);
                                //For Testing
                                console.log(results);
                                //Return certain related field's alias name.
                                function getRelatedFieldsAlias(a){
                                    var temp_layerfields = results.fields;
                                    for(var i = 0;i<temp_layerfields.length;i++){
                                        if(temp_layerfields[i].name == a){
                                            return temp_layerfields[i].alias;
                                        }
                                    }
                                }
                                //Define htmls for storing related fields' part's InnerHTML.
                                var htmls = "";
                                //Define a request object
                                var xmlhttp;
                                //Define empty string to store responsed string
                                var obj = "";
                                // code for IE7+, Firefox, Chrome, Opera, Safari
                                if (window.XMLHttpRequest) {
                                    //New Request object and give value to xmlhttp
                                    xmlhttp = new XMLHttpRequest();
                                    //Define an array for storing responsed jsons (each catchpit event may possess attachments, so need to call many times). Because each point --- catchpit event is one to many relationship and each record is also one to many relationship to attachments.
                                    var attArray = new Array();
                                    //call all of related records' rest page and get the responsed jsons
                                    for(var a = 0;a<feature.length;a++){
                                        //using get restful api to get each feature's json. each loop the feature[a].attributes.OBJECTID will change.
                                        xmlhttp.open("POST", url+"/" + feature[a].attributes.OBJECTID + "/attachments?f=pjson&token="+service_token, false);
                                        // send request
                                        xmlhttp.send();
                                        //Convert response json to strings
                                        obj = eval("(" + xmlhttp.responseText + ")");
                                        console.log(obj);
                                        //Used for storing each related record's attachements json
                                        attArray.push(obj);
                                    }
                                } else {// code for IE6, IE5
                                    //If needs, write code for IE in here
                                }
                                //Define the location link in order to use in <img> label
                                var srcc = url+"/";
                                //When certain point doesn't possess related records
                                if(feature.length==0){
                                    temphtml += "<br/><div>There are no related records</div><br/>";
                                    dt.innerHTML = temphtml;
                                }else{
                                    //When ceratin point possesses only one related record but it does't possess any attachment
                                    if(attArray.length==1 && attArray[0].attachmentInfos.length==0){
                                        //Make the number of related records one variable.
                                        temphtml += "<br/><a onclick=\"btn1("+ "9999" +")\" style=\"text-decoration:underline;color:blue\">"+"Show "+1+" related records"+"</a>";
                                        dt.innerHTML = temphtml;
                                        for(var i=0;i<feature.length;i++){
                                            htmls = "<table border=\"1\"><tr bgcolor=\"#C8C8C8\"><th><b>Re Fields Alias</b></th><th><b>Re Values</b></th></tr>";
                                            for(var x in (feature[i].attributes)){
                                                if((feature[i].attributes)[x] !== null && ((feature[i].attributes)[x].toString()).length == 13 && checkNumber((feature[i].attributes)[x]) == true ){
                                                    htmls += "<tr style="+ getRelatedFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getRelatedFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+getLocalTime((feature[i].attributes)[x])+"</td></tr>";
                                                }else{
                                                    if((feature[i].attributes)[x] == null){
                                                        htmls += "<tr style="+ getRelatedFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getRelatedFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+"</td></tr>";
                                                    }else{
                                                        htmls += "<tr style="+ getRelatedFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getRelatedFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+(feature[i].attributes)[x]+"</td></tr>";
                                                    }
                                                }
                                            }
                                            htmls += "</table><br/>";
                                        }
                                        fancy.innerHTML = htmls;
                                    }//When certain point possesses only one related record and also has some attachments
                                    else if(attArray.length==1 && attArray[0].attachmentInfos.length > 0){
                                        //Make the number of related records one variable.
                                        temphtml += "<br/><a onclick=\"btn1("+ "9999" +")\" style=\"text-decoration:underline;color:blue\">"+"Show "+1+" related records"+"</a>";
                                        dt.innerHTML = temphtml;
                                        for(var i=0;i<feature.length;i++){
                                            htmls = "<table border=\"1\"><tr bgcolor=\"#C8C8C8\"><th><b>Re Fields Alias</b></th><th><b>Re Values</b></th></tr>";
                                            for(var x in (feature[i].attributes)){
                                                if((feature[i].attributes)[x] !== null && ((feature[i].attributes)[x].toString()).length == 13 && checkNumber((feature[i].attributes)[x]) == true ){
                                                    htmls += "<tr style="+ getRelatedFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getRelatedFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+getLocalTime((feature[i].attributes)[x])+"</td></tr>";
                                                }else{
                                                    if((feature[i].attributes)[x] == null){
                                                        htmls += "<tr style="+ getRelatedFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getRelatedFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+"</td></tr>";
                                                    }else{
                                                        htmls += "<tr style="+ getRelatedFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getRelatedFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+(feature[i].attributes)[x]+"</td></tr>";
                                                    }
                                                }
                                            }
                                            htmls += "</table><br/>";
                                            //Add attachments
                                            for (var j = 0; j < attArray[0].attachmentInfos.length; j++) {
                                                htmls += "<div><a href=" + "\"" + srcc + feature[i].attributes.OBJECTID.toString() +  "/attachments/"+ attArray[i].attachmentInfos[j].id.toString() + "\"" + "download=\"w3logo\">" + "<img src =" + "\"" + srcc + feature[i].attributes.OBJECTID.toString() +  "/attachments/"+ attArray[i].attachmentInfos[j].id.toString() + "\"" + "class=\""+i+"\"" + "height=\"120\"" +"width=\"120\"" + "/>"+"</a>"+"</div><br/>";
                                            }
                                        }
                                        fancy.innerHTML = htmls;
                                    }else{
                                        //Make the number of related records one variable.
                                        temphtml += "<br/><a onclick=\"btn1("+ "9999" +")\" style=\"text-decoration:underline;color:blue\">"+"Show "+attArray.length+" related records"+"</a>";
                                        dt.innerHTML = temphtml;
                                        //When certain point poseesses several related records and has some attachments.
                                        for(var i=0;i<feature.length;i++){
                                            htmls += "<table border=\"1\"><tr bgcolor=\"#C8C8C8\"><th><b>Re Fields Alias</b></th><th><b>Re Values</b></th></tr>";
                                            for(var x in (feature[i].attributes)){
                                                if((feature[i].attributes)[x] !== null && ((feature[i].attributes)[x].toString()).length == 13 && checkNumber((feature[i].attributes)[x]) == true ){
                                                    htmls += "<tr style="+ getRelatedFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getRelatedFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+getLocalTime((feature[i].attributes)[x])+"</td></tr>";
                                                }else{
                                                    if((feature[i].attributes)[x] == null){
                                                        htmls += "<tr style="+ getRelatedFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getRelatedFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+"</td></tr>";
                                                    }else{
                                                        htmls += "<tr style="+ getRelatedFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getRelatedFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+(feature[i].attributes)[x]+"</td></tr>";
                                                    }                                                }
                                            }
                                            htmls += "</table><br/>";
                                            //Add attachments
                                            for (var j = 0; j < attArray[i].attachmentInfos.length; j++) {
                                                htmls += "<div><a href=" + "\"" + srcc + feature[i].attributes.OBJECTID.toString() +  "/attachments/"+ attArray[i].attachmentInfos[j].id.toString() + "\"" + "download=\"w3logo\">" + "<img src =" + "\"" + srcc + feature[i].attributes.OBJECTID.toString() +  "/attachments/"+ attArray[i].attachmentInfos[j].id.toString() + "\"" + "class=\""+i+"\"" + "height=\"120\"" +"width=\"120\"" + "/>"+"</a>"+"</div><br/>";
                                            }
                                        }
                                        fancy.innerHTML = htmls;
                                    }
                                }
                            });
                        });
                    }
                }

//2nd Function, display multiple elements on panel in the mean time.----------------------------------------------------------------------------------------------------------------------------

                //Initialize targetLayer as selected layer
                var targetLayer = "";
                //Initialize selecthtml as filed's parts' innerHTML.
                var selecthtml = "";
                //Decide weather the selected layer is feature layer.
                if(this.config.contextMenu.layerType == "FeatureServerlayer"){
                    //Assign this selected layer to targetLayer.
                    targetLayer = this.map.getLayer(this.map.graphicsLayerIds[this.config.contextMenu.graphicLayerID]);
                    //2nd Function, feature selection
                    targetLayer.on("selection-complete",function(event){
                        //Get selection results.
                        getSelection(event);
                        //Assign empty string to related part, in this function, all of inner codes are added in selecthtml.
                        document.getElementById('fancy').innerHTML = "";
                        //Initialize xixi = 1.
                        xixi = 1;
                    });
                }else{
                    //If this selected layer belongs to map layer, no functions.
                    targetLayer = this.map.getLayer(this.map.layerIds[this.config.contextMenu.layerSelectedID]);
                    //Just print it for testing.
                    console.log(targetLayer);
                }
                //Define getSelection function.
                function getSelection(response){
                    //Return certain field's alias name.
                    function getFieldsAlias(a){
                        var temp_layerfields = response.features[0]._graphicsLayer.fields;
                        for(var i = 0;i<temp_layerfields.length;i++){
                            if(temp_layerfields[i].name == a){
                                return temp_layerfields[i].alias;
                            }
                        }
                    }
                    //Define value named invalid to store selected points or table rows.
                    var invalid = response.features;
                    //Define value named dt to store 'divShowResult' value
                    var dt = document.getElementById('divShowResult');
                    //Decide whether Selected items are none.
                    if(invalid.length==0){
                        console.log("hahahaha");
                        dt.innerHTML = "";
                    }else{
                        //Request rest page to get related fields information.
                        require(["esri/tasks/QueryTask", "esri/tasks/query", "dojo/domReady!"], function (QueryTask, Query) {
                            //Clear panel's html.
                            dt.innerHTML = "";
                            //Clear selecthtml.
                            selecthtml = "";
                            //Initialize className for controlling single element's "Expand" button.
                            var className = "";
                            //Initialize attr for storing response.features[mark].attributes in next step.
                            var attr = "";
                            //Read all of selected points or table rows.
                            for(var mark = 0;mark<invalid.length;mark++){
                                //Define foreignKeyField_value to store layer's foreign key field.
                                var foreignKeyField_value = response.features[mark].attributes[foreignKeyField];
                                //Use url and relatedTableID to query from rest page.
                                var url = layerUrl+"/"+relatedTableID;
                                //Define queryTask and input related table link.
                                var queryTask = new QueryTask(url);
                                //Define query variable
                                var query = new Query();
                                //No geometry return
                                query.returnGeometry = false;
                                //Set all fields
                                query.outFields = ["*"];
                                //Define sql codes.
                                var sql = foreignRelatedKeyField+"=" + "\'" + foreignKeyField_value + "\'" + "";
                                query.where = sql;
                                //Using (function(index){})(mark) type to confirm accessing all of loops' mark value in query function.
                                (function(index){
                                    //When resolved, returns features and graphics that satisfy the query.
                                    queryTask.execute(query).then(function (results) {
                                        //Define an object to store result's features.
                                        var feature = results.features;
                                        //Define the content which will dynamically display on the bottom of page.
                                        console.log(feature);
                                        //For Testing.
                                        console.log(results);
                                        //Return certain related field's alias name.
                                        function getRelatedFieldsAlias(a){
                                            var temp_layerfields = results.fields;
                                            for(var i = 0;i<temp_layerfields.length;i++){
                                                if(temp_layerfields[i].name == a){
                                                    return temp_layerfields[i].alias;
                                                }
                                            }
                                        }
                                        //Define a request object
                                        var xmlhttp;
                                        //Define empty string to store responsed string
                                        var obj = "";
                                        // code for IE7+, Firefox, Chrome, Opera, Safari
                                        if (window.XMLHttpRequest) {
                                            //New Request object and give value to xmlhttp
                                            xmlhttp = new XMLHttpRequest();
                                            //Define an array for storing responsed jsons (each catchpit event may possess attachments, so need to call many times). Because each point --- catchpit event is one to many relationship and each record is also one to many relationship to attachments.
                                            var attArray = new Array();
                                            //Define a tempurl;
                                            var tempurl = "";
                                            //call all of related records' rest page and get the responsed jsons
                                            for(var a = 0;a<feature.length;a++){
                                                tempurl = url+"/" + feature[a].attributes.OBJECTID + "/attachments?f=pjson&token="+service_token;
                                                //using get restful api to get each feature's json. each loop the feature[a].attributes.OBJECTID will change.
                                                xmlhttp.open("POST",tempurl,false);
                                                // send request
                                                xmlhttp.send();
                                                //Convert response json to strings
                                                obj = eval("(" + xmlhttp.responseText + ")");
                                                console.log(obj);
                                                //Used for storing each related record's attachements json
                                                attArray.push(obj);
                                            }
                                        } else {// code for IE6, IE5
                                            //If needs, write code for IE in here
                                        }
                                        //Define the location link in order to use in <img> label
                                        var srcc = url+"/";
                                        //When certain point doesn't possess related records
                                        if(feature.length==0){
                                            //Assign one feature's attributes to attr.
                                            attr = response.features[index].attributes;
                                            //Adding layout html codes.
                                            selecthtml += "<table border=\"1\"><tr bgcolor=\"#C8C8C8\"><th><b>Fields Alias</b></th><th><b>Values</b></th></tr>";
                                            for(var x in attr){
                                                if(attr[x] !== null && checkNumber(attr[x]) == true && (attr[x].toString()).length == 13){
                                                    selecthtml += "<tr style="+ getMainFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+getLocalTime(attr[x])+"</td></tr>";
                                                }else{
                                                    if(attr[x] == null){
                                                        selecthtml += "<tr style="+ getMainFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+"</td></tr>";
                                                    }else{
                                                        if(attr[x] == null){
                                                            selecthtml += "<tr style="+ getMainFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+"</td></tr>";
                                                        }else{
                                                            selecthtml += "<tr style="+ getMainFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+attr[x]+"</td></tr>";
                                                        }                                                    }
                                                }
                                                if(getFieldsAlias(x) == "OBJECTID"){
                                                    className = attr[x];
                                                    console.log(className);
                                                }
                                            }
                                            selecthtml += "</table><br/>";
                                            selecthtml += "<div>There are no related records</div><br/>";
                                            //Assign selecthtml to dt.innerHTML.
                                            dt.innerHTML = selecthtml;
                                        }else{
                                            //When ceratin point possesses only one related record but it does't possess any attachment
                                            if(attArray.length==1 && attArray[0].attachmentInfos.length==0){
                                                //Assign one feature's attributes to attr.
                                                attr = response.features[index].attributes;
                                                //Adding layout html codes.
                                                selecthtml += "<table border=\"1\"><tr bgcolor=\"#C8C8C8\"><th><b>Fields Alias</b></th><th><b>Values</b></th></tr>";
                                                for(var x in attr){
                                                    if(attr[x] !== null && checkNumber(attr[x]) == true && (attr.toString()).length == 13){
                                                        selecthtml += "<tr style="+ getMainFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+getLocalTime(attr[x])+"</td></tr>";
                                                    }else{
                                                        if(attr[x] == null){
                                                            selecthtml += "<tr style="+ getMainFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+"</td></tr>";
                                                        }else{
                                                            selecthtml += "<tr style="+ getMainFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+attr[x]+"</td></tr>";
                                                        }
                                                    }
                                                    if(getFieldsAlias(x) == "OBJECTID"){
                                                        className = attr[x];
                                                        console.log(className);
                                                    }
                                                }
                                                selecthtml += "</table>";
                                                //Make the number of related records one variable.
                                                selecthtml += "<br/><a onclick=\"btnSelection("+ className +")\" style=\"text-decoration:underline;color:blue\">"+"Show "+1+" related records"+"</a><br/>";
                                                selecthtml += "<br/><div class=\""+ className +"\" style=\"font-size:12px;display:none\">";
                                                //Related fields part.
                                                for(var i=0;i<feature.length;i++){
                                                    selecthtml += "<table border=\"1\"><tr bgcolor=\"#C8C8C8\"><th><b>Re Fields Alias</b></th><th><b>Re Values</b></th></tr>";
                                                    for(var x in (feature[i].attributes)){
                                                        if((feature[i].attributes)[x] !== null && ((feature[i].attributes)[x].toString()).length == 13 && checkNumber((feature[i].attributes)[x]) == true ){
                                                            selecthtml += "<tr style="+ getRelatedFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getRelatedFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+getLocalTime((feature[i].attributes)[x])+"</td></tr>";
                                                        }else{
                                                            if((feature[i].attributes)[x] == null){
                                                                selecthtml += "<tr style="+ getRelatedFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getRelatedFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+"</td></tr>";
                                                            }else{
                                                                selecthtml += "<tr style="+ getRelatedFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getRelatedFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+(feature[i].attributes)[x]+"</td></tr>";
                                                            }
                                                        }
                                                    }
                                                    selecthtml += "</table>";
                                                }
                                                selecthtml += "</div><br/>";
                                                //Assign selecthtml to dt.innerHTML.
                                                dt.innerHTML = selecthtml;
                                            }//When certain point possesses only one related record and also has some attachments
                                            else if(attArray.length==1 && attArray[0].attachmentInfos.length > 0){
                                                //Assign one feature's attributes to attr.
                                                attr = response.features[index].attributes;
                                                //Adding layout html codes.
                                                selecthtml += "<table border=\"1\"><tr bgcolor=\"#C8C8C8\"><th><b>Fields Alias</b></th><th><b>Values</b></th></tr>";
                                                for(var x in attr){
                                                    if(attr[x] !== null && checkNumber(attr[x]) == true && (attr[x].toString()).length == 13){
                                                        selecthtml += "<tr style="+ getMainFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+getLocalTime(attr[x])+"</td></tr>";
                                                    }else{
                                                        if(attr[x] == null){
                                                            selecthtml += "<tr style="+ getMainFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+"</td></tr>";
                                                        }else{
                                                            selecthtml += "<tr style="+ getMainFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+attr[x]+"</td></tr>";
                                                        }
                                                    }
                                                    if(getFieldsAlias(x) == "OBJECTID"){
                                                        className = attr[x];
                                                        console.log(className);
                                                    }
                                                }
                                                selecthtml += "</table>";
                                                selecthtml += "<br/><a onclick=\"btnSelection("+ className +")\" style=\"text-decoration:underline;color:blue\">"+"Show "+1+" related records"+"</a><br/>";
                                                selecthtml += "<br/><div class=\""+ className +"\" style=\"font-size:12px;display:none\">";
                                                //Related fields part.
                                                for(var i=0;i<feature.length;i++){
                                                    selecthtml += "<table border=\"1\"><table cellspacing=\"10\"><tr bgcolor=\"#C8C8C8\"><th><b>Re Fields Alias</b></th><th><b>Re Values</b></th></tr>";
                                                    for(var x in (feature[i].attributes)){
                                                        if((feature[i].attributes)[x] !== null && ((feature[i].attributes)[x].toString()).length == 13 && checkNumber((feature[i].attributes)[x]) == true ){
                                                            selecthtml += "<tr style="+ getRelatedFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getRelatedFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+getLocalTime((feature[i].attributes)[x])+"</td></tr>";
                                                        }else{
                                                            if((feature[i].attributes)[x] == null){
                                                                selecthtml += "<tr style="+ getRelatedFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getRelatedFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+"</td></tr>";
                                                            }else{
                                                                selecthtml += "<tr style="+ getRelatedFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getRelatedFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+(feature[i].attributes)[x]+"</td></tr>";
                                                            }
                                                        }
                                                    }
                                                    selecthtml += "</table>";
                                                    for (var j = 0; j < attArray[0].attachmentInfos.length; j++) {
                                                        selecthtml += "<div><a href=" + "\"" + srcc + feature[i].attributes.OBJECTID.toString() +  "/attachments/"+ attArray[i].attachmentInfos[j].id.toString() + "\"" + "download=\"w3logo\">" + "<img src =" + "\"" + srcc + feature[i].attributes.OBJECTID.toString() +  "/attachments/"+ attArray[i].attachmentInfos[j].id.toString() + "\"" + "class=\""+i+"\"" + "height=\"120\"" +"width=\"120\"" + "/>"+"</a>"+"</div><br/>";
                                                    }
                                                }
                                                selecthtml += "</div><br/>";
                                                //Assign selecthtml to dt.innerHTML.
                                                dt.innerHTML = selecthtml;
                                            }else{
                                                //Assign one feature's attributes to attr.
                                                attr = response.features[index].attributes;
                                                //Adding layout html codes.
                                                selecthtml += "<table border=\"1\"><tr bgcolor=\"#C8C8C8\"><th><b>Fields Alias</b></th><th><b>Values</b></th></tr>";
                                                for(var x in attr){
                                                    if(attr[x] !== null && checkNumber(attr[x]) == true && (attr[x].toString()).length == 13){
                                                        selecthtml += "<tr style="+ getMainFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+getLocalTime(attr[x])+"</td></tr>";
                                                    }else{
                                                        if(attr[x] == null){
                                                            selecthtml += "<tr style="+ getMainFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+"</td></tr>";
                                                        }else{
                                                            selecthtml += "<tr style="+ getMainFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+attr[x]+"</td></tr>";
                                                        }
                                                    }
                                                    if(getFieldsAlias(x) == "OBJECTID"){
                                                        className = attr[x];
                                                        console.log(className);
                                                    }
                                                }
                                                selecthtml += "</table>";
                                                selecthtml += "<br/><a onclick=\"btnSelection("+ className +")\" style=\"text-decoration:underline;color:blue\">"+"Show "+attArray.length+" related records"+"</a><br/>";
                                                selecthtml += "<br/><div class=\""+ className +"\" style=\"font-size:12px;display:none\">";
                                                //Related fields part.
                                                for(var i=0;i<feature.length;i++){
                                                    selecthtml += "<table border=\"1\"><tr bgcolor=\"#C8C8C8\"><th><b>Re Fields Alias</b></th><th><b>Re Values</b></th></tr>";
                                                    for(var x in (feature[i].attributes)){
                                                        if((feature[i].attributes)[x] !== null && ((feature[i].attributes)[x].toString()).length == 13 && checkNumber((feature[i].attributes)[x]) == true ){
                                                            selecthtml += "<tr style="+ getRelatedFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getRelatedFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+getLocalTime((feature[i].attributes)[x])+"</td></tr>";
                                                        }else{
                                                            if((feature[i].attributes)[x] == null){
                                                                selecthtml += "<tr style="+ getRelatedFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getRelatedFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+"</td></tr>";
                                                            }else{
                                                                selecthtml += "<tr style="+ getRelatedFieldsDisplay(x)+"><td class=\""+x+"\""+"><b>"+getRelatedFieldsAlias(x)+"</b></td>"+"<td class=\""+x+"\""+">"+(feature[i].attributes)[x]+"</td></tr>";
                                                            }
                                                        }
                                                    }
                                                    selecthtml += "</table><br/>";
                                                    for (var j = 0; j < attArray[i].attachmentInfos.length; j++) {
                                                        selecthtml += "<div><a href=" + "\"" + srcc + feature[i].attributes.OBJECTID.toString() +  "/attachments/"+ attArray[i].attachmentInfos[j].id.toString() + "\"" + "download=\"w3logo\">" + "<img src =" + "\"" + srcc + feature[i].attributes.OBJECTID.toString() +  "/attachments/"+ attArray[i].attachmentInfos[j].id.toString() + "\"" + "class=\""+i+"\"" + "height=\"120\"" +"width=\"120\"" + "/>"+"</a>"+"</div><br/>";
                                                    }
                                                }
                                                selecthtml += "</div><br/>";
                                                //Assign selecthtml to dt.innerHTML.
                                                dt.innerHTML = selecthtml;
                                            }
                                        }
                                    });
                                })(mark);
                            }
                        });
                    }
                }
            },
            //When widget close, implement this function
            onClose: function () {
                console.log("close");
            }
        });
    });