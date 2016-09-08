   /*
 * Copyright (c) WSO2 Inc, 2014. (http://wso2.com) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

$(document).ready(function() {
 var url = "/designer/asts/eprocess/apis/processes?type=eprocess";
  //Converting the input field to token input
  //input fetches data and populates the field
     $("#properties_predecessors").tokenInput(url, {
       preventDuplicates: true, theme:"facebook",
       onResult: function(results) {
         var assets = {
           data: []
         }
         $.each(results, function() {
           for (var i in results) {
             var item = results[i];
             assets.data.push({
               "path": item.path,
               "id": item.id,
               "name": item.attributes.overview_name
             });
           };
         });
         return assets.data;
       },
       tokenFormatter: function(item) {
         return "<li><a href = /designer/asts/eprocess/details/" + item.id + ">" + item.name + " </a></li>"
       }
     });
     //Converting the input field to token input
     //input fetches data and populates the field
     $("#properties_sucessors").tokenInput(url, {
       preventDuplicates: true,theme:"facebook",
       onResult: function(results) {
         var assets = {
           data: []
         }
         $.each(results, function() {
           for (var i in results) {
             var item = results[i];
             assets.data.push({
               "path": item.path,
               "id": item.id,
               "name": item.attributes.overview_name
             });

           };
         });
         return assets.data;
       },
       tokenFormatter: function(item) {
         return "<li><a href = /designer/asts/eprocess/details/" + item.id + ">" + item.name + " </a></li>"
       }
     });
     //Converting the input field to token input
     //input fetches data and populates the field
     $("#properties_generalizations").tokenInput(url, {
       preventDuplicates: true,theme:"facebook",
       onResult: function(results) {
         var assets = {
           data: []
         }
         $.each(results, function() {
           for (var i in results) {
             var item = results[i];
             assets.data.push({
               "path": item.path,
               "id": item.id,
               "name": item.attributes.overview_name
             });
           };
         });
         return assets.data;
       },
       tokenFormatter: function(item) {
         return "<li><a href = /designer/asts/eprocess/details/" + item.id + ">" + item.name + " </a></li>"
       }
     });
     //Converting the input field to token input
     //input fetches data and populates the field
     $("#properties_specializations").tokenInput(url, {
       preventDuplicates: true,theme:"facebook",
       onResult: function(results) {
         var assets = {
           data: []
         }
         $.each(results, function() {
           for (var i in results) {
             var item = results[i];
             assets.data.push({
               "path": item.path,
               "id": item.id,
               "name": item.attributes.overview_name
             });
           };
         });
         return assets.data;
       },
       tokenFormatter: function(item) {
         return "<li><a href = /designer/asts/eprocess/details/" + item.id + ">" + item.name + " </a></li>"
       }
     });
});