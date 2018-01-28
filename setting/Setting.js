///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2016 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

/*Using configurable page to create json and delivery it to main page in order to control which field will display*/

//Define layerFields to store selected layer's main fields
var layerFields = "";
//Define relatedLayerFields to store selected related layer's fields
var relatedLayerFields = "";
//Define related table name.
var relatedTableName = "";
//Define token from this server
var token = "";
//Configurable page main part
define([
        'dojo/_base/declare',
        'jimu/BaseWidgetSetting',
        'jimu/LayerInfos/LayerInfos',
        'dijit/_WidgetsInTemplateMixin',
        'dijit/form/CheckBox',
        'jimu/dijit/CheckBox'
    ],
    function(
        declare,
        BaseWidgetSetting,
        LayerInfos,
        _WidgetsInTemplateMixin) {
        return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
            baseClass: 'jimu-widget-layerList-setting',
            //Initialize part
            startup: function() {
                this.inherited(arguments);
                //Add all of server layers from map in layerList except based map.
                for(var i = 1;i<this.map.layerIds.length;i++){
                    document.getElementById('selectlayers').options.add(new Option(this.map.getLayer(this.map.layerIds[i]).arcgisProps.title,this.map.getLayer(this.map.layerIds[i]).arcgisProps.title));
                }
                //Add all of graphic layers from map in layerList except those which don't possess url feature
                for(var i = 0;i<this.map.graphicsLayerIds.length;i++){
                    if(this.map.getLayer(this.map.graphicsLayerIds[i]).url !== null){
                        document.getElementById('selectlayers').options.add(new Option(this.map.getLayer(this.map.graphicsLayerIds[i]).arcgisProps.title,this.map.getLayer(this.map.graphicsLayerIds[i]).arcgisProps.title));
                    }
                }
                this.setConfig(this.config);
            },
            //Setting part
            setConfig: function(config) {
                //For second opening widget. Remember the setting records.
                if(typeof(config.contextMenu["Report_title"]) !== "undefined"){
                    console.log(config.contextMenu["Report_title"]);
                    document.getElementById('Report_title').value = config.contextMenu["Report_title"];
                }
                if(typeof(config.contextMenu["layerSelectedID"]) !== "undefined"){
                    console.log(config.contextMenu["layerSelectedID"]);
                    document.getElementById('selectlayers').selectedIndex = config.contextMenu["layerSelectedID"];
                }
                if(layerFields !== ""){
                    console.log(layerFields);
                    var temp = "";
                    temp = "<div class=\"control-popupmenu-part\" data-dojo-attach-point=\"controlPopupMenuPart\"><div class=\"title\">Choose which main fields will be shown in widget.</div>"+"<table class=\"control-popupmenu-table\"><tbody>";
                    //Adding fields layout codes to layoutInnerHTML.
                    for(var i = 0;i<layerFields.length;i++){
                        if(config.contextMenu[layerFields[i].name] == true){
                            temp += "<tr><td><input type=\"checkbox\" id = \""+layerFields[i].name+"\" checked></td><td class=\"label\">"+layerFields[i].alias+"</td></tr>";
                        }else{
                            temp += "<tr><td><input type=\"checkbox\" id = \""+layerFields[i].name+"\"></td><td class=\"label\">"+layerFields[i].alias+"</td></tr>";
                        }
                    }
                    //Adding end html codes to layoutInnerHTML.
                    temp += "</tbody></table></div>";
                    //Assign layoutInnerHTML to layout's innerHTML.
                    document.getElementById('Main-fields').innerHTML = temp;
                }
                if(relatedLayerFields !== ""){
                    console.log(relatedLayerFields);
                    var temprelated = "";
                    //Adding title html codes to relatedLayoutInnerHTML.
                    temprelated = "<div class=\"control-popupmenu-part\" data-dojo-attach-point=\"controlPopupMenuPart\"><div class=\"title\">Related Table Name: "+ relatedTableName + "</div>";
                    temprelated += "<table class=\"control-popupmenu-table\"><tbody>";
                    //Adding fields layout codes to relatedLayoutInnerHTML.
                    for(var i = 0;i<relatedLayerFields.length;i++){
                        if(config.contextMenu[("Re_"+relatedLayerFields[i].name)] == true){
                            temprelated += "<tr><td><input type=\"checkbox\" id = \""+"Re_"+relatedLayerFields[i].name+"\" checked></td><td class=\"label\">"+relatedLayerFields[i].alias+"</td></tr>";
                        }else{
                            temprelated += "<tr><td><input type=\"checkbox\" id = \""+"Re_"+relatedLayerFields[i].name+"\"></td><td class=\"label\">"+relatedLayerFields[i].alias+"</td></tr>";
                        }
                    }
                    //Adding end html codes to relatedLayoutInnerHTML.
                    temprelated += "</tbody></table></div>";
                    document.getElementById('Related-fields').innerHTML = temprelated;
                }

                //For First opening the widget
                //Define map object.
                var map = this.map;
                //Define fields object to store.
                var fields = "";
                //Selected layer.
                var layerSelected = "";
                //Selected layerID.
                var layerSelectedID = "";
                //Graphic LayerID,if the map has graphic layers, graphic layerID is layer.length-(map layer).length
                var graphicLayerID = "";
                //Define object to store "Main-fields"(id)'s innerHTML.
                var layoutInnerHTML = "";
                //Define object to store "Related-fields"(id)'s innerHTML.
                var relatedLayoutInnerHTML = "";
                //Define object to store main table's foreignKey.
                var foreignKeyField = "";
                //Define object to store related table's foreignKey.
                var foreignRelatedKeyField = "";
                //Define object to store relatedTableID in order to make more request.
                var relatedTableID = "";
                //Get select list object and named layerList
                var layerList=document.getElementById('selectlayers');
                //Define object to store "Main-fields"(id) information.
                var layout = document.getElementById('Main-fields');
                //Define object to store "Related-fields"(id) information.
                var relatedLayout = document.getElementById('Related-fields');
                //Define object to store report title
                var report_title = document.getElementById('Report_title');
                //Define a Create Json function
                function createJson(prop,val){
                        config.contextMenu[prop] = val;
                }
                //Get token from current service
                require([
                    'esri/IdentityManager'],
                    function(IdentityManager){
                        token = IdentityManager.credentials[0].token;
                        console.log(token);
                        //Create token json
                        createJson("Service_Token",token);
                    });
                //Create Json of report title
                createJson("Report_title",report_title.value);
                //When layerList change the selected layer, it will implement this function.
                layerList.onchange = function(){
                    //Setting layer visibility.
                    for(var i = 1;i<(map.layerIds.length+map.graphicsLayerIds.length);i++){
                        if(i !== layerList.selectedIndex){
                            //Set all of un-selected layers invisible. Implement different function according to different types of layer.
                            if(i<map.layerIds.length){
                                //Server Layer.
                                //map.getLayer(map.layerIds[i]).setVisibility(false);
                            }else{
                                //Graphic Layer.
                                if(map.getLayer(map.graphicsLayerIds[i-map.layerIds.length]).url !== null){
                                    //map.getLayer(map.graphicsLayerIds[i-map.layerIds.length]).setVisibility(false);
                                }
                            }
                        }else{//Set selected layer visible.
                            //If selected layer is a server layer
                            if(i<map.layerIds.length){
                                //map.getLayer(map.layerIds[i]).setVisibility(true);
                                //Store the selected ID in layerList.
                                layerSelectedID = i;
                                //Store selected layer in layerList.
                                layerSelected = map.getLayer(map.layerIds[layerSelectedID]);
                                //For Testing
                                console.log(layerSelectedID);
                                console.log(layerSelected);
                            }else{//If selected layer is a graphic layer
                                //map.getLayer(map.graphicsLayerIds[i-map.layerIds.length]).setVisibility(true);
                                //Store the selected ID in layerList.
                                layerSelectedID = i;
                                //Store the graphic ID in layerList
                                graphicLayerID = i-map.layerIds.length;
                                //Store selected layer in layerList.
                                layerSelected = map.getLayer(map.graphicsLayerIds[i-map.layerIds.length]);
                                //For Testing
                                console.log(layerSelectedID);
                                console.log(layerSelected);
                            }
                        }
                    }
                    //Define json and delete all of previous json key and value when choosing other layer.
                    var json = config.contextMenu;
                    for(var js in json){
                        delete json[js];
                    }
                    //Define function to read selected layer's fields and displaying on the configurable page and create json at mean time.
                    getFields(layerList);
                }
                function getFields(layer){
                    //Identify selected layer's field and see whether it is map server layer or feature server layer.
                    //If layerSelected.filed == "undefined", it is map server layer.
                    if(typeof(layerSelected.fields) === "undefined" ){
                        //If the layer can't be accessed fields directly, Create Json of layer type --> MapServerlayer
                        createJson("layerType","MapServerlayer");
                        //Create Json of layerSelectedID
                        createJson("layerSelectedID",layerSelectedID);
                        //If certain layer is selected, implement this function.
                        if(layer.options[layerSelectedID].selected == true){
                            //Request this layer restful api to get layer information.
                            require([
                                "esri/request"
                            ], function(esriRequest) {
                                //Possible needs to be changed next week. Define layerUrl to prepare layer's URL in order to do further request and also need to input token.
                                var layerUrl = map.getLayer(map.layerIds[layerSelectedID]).url + "/0?f=pjson&token="+token;
                                //Define layerRequest to request restful page of the layer.
                                var layersRequest = esriRequest({
                                    url: layerUrl,
                                    content: { f: "json" },
                                    handleAs: "json",
                                    callbackParamName: "callback"
                                });
                                //After get the response, this function will implement consecutively.
                                layersRequest.then(
                                    function(response) {
                                        //For testing, print the response.
                                        console.log("Success: ", response);
                                        //Define object to store response's fields
                                        layerFields = response.fields;
                                        //Define promise to make next step implemented consecutively.
                                        var promise = new Promise(function(resolve,reject){
                                            if(layerFields!==""){
                                                resolve("Success");
                                            }else{
                                                reject("error");
                                            }
                                        });
                                        //If layerFields isn't empty string, implement next function.
                                        promise.then(function(value){
                                            //If succeed,just for testing.
                                            console.log(value);
                                            //Adding title html codes to layoutInnerHTML.
                                            layoutInnerHTML = "<div class=\"control-popupmenu-part\" data-dojo-attach-point=\"controlPopupMenuPart\"><div class=\"title\">Choose which main fields will be shown in widget.</div>"+"<table class=\"control-popupmenu-table\"><tbody>";
                                            //Adding fields layout codes to layoutInnerHTML.
                                            for(var i = 0;i<layerFields.length;i++){
                                                layoutInnerHTML += "<tr><td><input type=\"checkbox\" id = \""+layerFields[i].name+"\"></td><td class=\"label\">"+layerFields[i].alias+"</td></tr>"
                                            }
                                            //Adding end html codes to layoutInnerHTML.
                                            layoutInnerHTML += "</tbody></table></div>";
                                            //Assign layoutInnerHTML to layout's innerHTML.
                                            layout.innerHTML = layoutInnerHTML;
                                        },function(error){
                                            //If fail,just for testing.
                                            console.log(error);
                                        });
                                        //Create Json based on layer field's alias.
                                        for(var i = 0;i<layerFields.length;i++){
                                            //initial values are false.
                                            createJson(layerFields[i].alias,false);
                                        }
                                        //Create layer url Json for next step.
                                        createJson("layer",layerSelected.url);
                                        //Create layerID Json for next step.
                                        //createJson("layerID",layerSelectedID);
                                        //Define function to read selected layer's related fields, displaying on the configurable page and create json at mean time.
                                        getRelatedFields(response.relationships);
                                    }, function(error) {
                                        //If it has some errors,implement this function
                                        console.log("Error: ", error.message);
                                    });
                            });
                        }
                    }else{//Selected layer is feature server layer.
                        if(layer.options[layerSelectedID].selected == true){
                            //If layer is feature layer, create Json of layer type --> FeatureServerlayer.
                            createJson("layerType","FeatureServerlayer");
                            //Create Json of layerSelectedID.
                            createJson("layerSelectedID",layerSelectedID);
                            //Create Json of graphicLayerID if it is a feature layer.
                            createJson("graphicLayerID",graphicLayerID);
                            //Store layer url.
                            var url = layerSelected.url;
                            //Delete the last string of url. eg:............/0.
                            url = url.slice(0,-2);
                            //Create json of layer url.
                            createJson("layer",url);
                            //Store feature layer's fields.
                            layerFields = layerSelected.fields;
                            //For Testing
                            console.log(layerFields);
                            //Adding title html codes to layoutInnerHTML.
                            layoutInnerHTML = "<div class=\"control-popupmenu-part\" data-dojo-attach-point=\"controlPopupMenuPart\"><div class=\"title\">Choose which main fields will be shown in widget.</div>"+"<table class=\"control-popupmenu-table\"><tbody>";
                            //Adding fields layout codes to layoutInnerHTML.
                            for(var i = 0;i<layerFields.length;i++){
                                layoutInnerHTML += "<tr><td><input type=\"checkbox\" id = \""+layerFields[i].name+"\"></td><td class=\"label\">"+layerFields[i].alias+"</td></tr>";
                            }
                            //Adding end html codes to layoutInnerHTML.
                            layoutInnerHTML += "</tbody></table></div>";
                            //Assign layoutInnerHTML to layout's innerHTML.
                            layout.innerHTML = layoutInnerHTML;
                            //Create Json based on layer field's alias.
                            for(var i = 0;i<layerFields.length;i++){
                                //initial values are false.
                                createJson(layerFields[i].name,false);
                            }
                            //Define function to read selected layer's related fields, displaying on the configurable page and create json at mean time.
                            getRelatedFields(layerSelected.relationships);
                        }
                    }
                }
                //getRelatedFields function.
                function getRelatedFields(related){
                    //If related array is empty.
                    if(typeof(related[0]) !== "undefined"){
                        //Create foreignKeyField and related tableID Json.
                        foreignKeyField = related[0].keyField;
                        relatedTableID = related[0].relatedTableId;
                        createJson("foreignKeyField",foreignKeyField);
                        createJson("relatedTableID",relatedTableID);
                        //For Testing.
                        console.log(foreignKeyField);
                        console.log(relatedTableID);
                        //Initialize related table's url.
                        var layerUrl1 = "";
                        //Same meaning and theory with the previous request function.
                        require([
                            "esri/request"
                        ], function(esriRequest) {
                            //If selected layer if map server layer.
                            if(layerSelectedID<map.layerIds.length){
                                layerUrl1 = layerSelected.url + "/"+relatedTableID+"?f=pjson&token="+token;
                            }//if selected layer is feature server layer
                            else{
                                layerUrl1 = layerSelected.url.slice(0,-2) + "/"+relatedTableID+"?f=pjson&token="+token;
                            }
                            //Define layerRequest to request restful page of the related table service.
                            var layersRequest = esriRequest({
                                url: layerUrl1,
                                content: { f: "json" },
                                handleAs: "json",
                                callbackParamName: "callback"
                            });
                            //After get the response, this function will implement consecutively.
                            layersRequest.then(
                                function(response) {
                                    //For testing, print the response.
                                    console.log("Success: ", response);
                                    //Define object to store response's fields
                                    relatedLayerFields = response.fields;
                                    //Define promise to make next step implemented consecutively.
                                    var promise = new Promise(function(resolve,reject){
                                        if(relatedLayerFields!==""){
                                            resolve("Success");
                                        }else{
                                            reject("error");
                                        }
                                    });
                                    //If layerFields isn't empty string, implement next function.
                                    promise.then(function(value){
                                        //If succeed,just for testing.
                                        console.log(value);
                                        relatedTableName = response.name;
                                        //Adding title html codes to relatedLayoutInnerHTML.
                                        relatedLayoutInnerHTML = "<div class=\"control-popupmenu-part\" data-dojo-attach-point=\"controlPopupMenuPart\"><div class=\"title\">Related Table Name: "+ relatedTableName + "</div>";
                                        relatedLayoutInnerHTML += "<table class=\"control-popupmenu-table\"><tbody>";
                                        //Adding fields layout codes to relatedLayoutInnerHTML.
                                        for(var i = 0;i<relatedLayerFields.length;i++){
                                            relatedLayoutInnerHTML += "<tr><td><input type=\"checkbox\" id = \""+"Re_"+relatedLayerFields[i].name+"\"></td><td class=\"label\">"+relatedLayerFields[i].alias+"</td></tr>";
                                        }
                                        //Adding end html codes to relatedLayoutInnerHTML.
                                        relatedLayoutInnerHTML += "</tbody></table></div>";
                                        //Assign layoutInnerHTML to layout's innerHTML.
                                        relatedLayout.innerHTML = relatedLayoutInnerHTML;
                                    },function(error){
                                        //If fail,just for testing.
                                        console.log(error);
                                    });
                                    for(var i = 0;i<relatedLayerFields.length;i++){
                                        //initial values are false.
                                        createJson(("Re_"+relatedLayerFields[i].name),false);
                                    }
                                    //Create foreignRelatedKeyField Json for next step.
                                    createJson("foreignRelatedKeyField",response.relationships[0].keyField);
                                }, function(error) {
                                    //If it has some errors,implement this function
                                    console.log("Error: ", error.message);
                                });
                        });
                    }else{
                        //If no related fields, don't add any code in relatedLayout.
                        relatedLayout.innerHTML = "";
                        //Assign empty string value to relatedLayerFields if related is empty string. Meaningful for getConfig part.
                        relatedLayerFields = "";
                    }
                }
            },
            //Getting Json part
             getConfig: function() {
                 //Re-assign the values based on clicking checkbox result to main fields.
                 for(var i = 0;i<layerFields.length;i++){
                     this.config.contextMenu[layerFields[i].name] = document.getElementById(layerFields[i].name).checked;
                 }
                 //If possess related table fields
                 if(relatedLayerFields !== ""){
                     //For testing
                     console.log(relatedLayerFields);
                     //Re-assign the values based on clicking checkbox result to related fields.
                     for(var i = 0;i<relatedLayerFields.length;i++){
                         this.config.contextMenu[("Re_"+relatedLayerFields[i].name)] = document.getElementById("Re_"+relatedLayerFields[i].name).checked;
                     }
                 }
                 //Assign title to "Report_title".
                 this.config.contextMenu["Report_title"] = document.getElementById("Report_title").value;
                 //Assign token to "Service_Token"
                 this.config.contextMenu["Service_Token"] = token;
                 //Print contextMenu for testing
                 if(!this.config.contextMenu) {
                     this.config.contextMenu = {};
                 }
                 return this.config;
             }
        });
    });
