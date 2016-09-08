/*
 *  Copyright (c) 2014, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */
/*
 Functionality related to viewing a selected chevron diagram in Publisher
 */
jsPlumb.ready(function(e) {
    chevronProperties = []; //store properties of each chevron
    var processId = 0; // update process model Id
    var connections = []; //store connections drawn 
    var descriptionsForChevrons = []; //Keep track of description value of each chevron
    var elementList = []; //store drawn elements to draw connections
    $("#viewMainProps").show();
    $("#viewElementProps").hide();
    // ajax call to get the process name the view belongs to
    $.ajax({
        type: "GET",
        url: "/publisher/assets/chevron/apis/nameStore",
        data: {
            type: "GET"
        },
        success: function(result) {
            getXmlForProcess(result);
        }
    });
    $('#canvasArea').dblclick(function(e) {
        $("#viewMainProps").show();
        $("#viewElementProps").hide();
    });
    //function to get the specific xml content for the given process
    function getXmlForProcess(process) {
        $.ajax({
            type: "GET",
            url: "/publisher/assets/chevron/apis/chevronxml",
            data: {
                type: "GET",
                name: process
            },
            success: function(xmlResult) {
                drawDiagramOnCanvas(xmlResult);
            }
        });
    }

    //get description value for the given element id
    function getDescriptionForElement(id) {
        var descriptionValue = "no description added";
        //retrieve the description for that element
        if (descriptionsForChevrons.length != 0) {
            for (var i = 0; i < descriptionsForChevrons.length; i++) {
                if (id == descriptionsForChevrons[i].id) {
                    descriptionValue = descriptionsForChevrons[i].description;
                    if(descriptionValue == '' || descriptionValue == null){
                        descriptionValue = "no description added";
                    }
                    return descriptionValue;
                }
            }
        }
        return descriptionValue;
    }

    //store description ,id pairs for existing elements
    function storeDescriptionsForExistingElements(id, description) {
        descriptionsForChevrons.push({
            id: id,
            description: description
        });
    }

    //function to draw retrieved chevron content to canvas
    function drawDiagramOnCanvas(xmlResult) {
        var test = xmlResult;
        test = test.replace(/&quot;/g, '"');
        test = test.split(',');
        var jsonObj = eval("(" + test + ")");
        // get length of elements  array
        var numberOfElements = jsonObj.diagram[0].chevrons[0].element.length;
        //store existing connections
        if (jsonObj.diagram[0].styles[0].flow.length != 0) {
            for (var i = 0; i < jsonObj.diagram[0].styles[0].flow.length; i++) {
                connections.push({
                    sourceId: jsonObj.diagram[0].styles[0].flow[i].sourceId,
                    targetId: jsonObj.diagram[0].styles[0].flow[i].targetId,
                    sourceAnchor1: jsonObj.diagram[0].styles[0].flow[i].sourceAnchor1,
                    sourceAnchor2: jsonObj.diagram[0].styles[0].flow[i].sourceAnchor2,
                    orientation1: jsonObj.diagram[0].styles[0].flow[i].orientation1,
                    orientation2: jsonObj.diagram[0].styles[0].flow[i].orientation2,
                    targetAnchor1: jsonObj.diagram[0].styles[0].flow[i].targetAnchor1,
                    targetAnchor2: jsonObj.diagram[0].styles[0].flow[i].targetAnchor2,
                    orientation3: jsonObj.diagram[0].styles[0].flow[i].orientation3,
                    orientation4: jsonObj.diagram[0].styles[0].flow[i].orientation4
                });
            }
        }
        //draw elements 
        for (var i = 0; i < numberOfElements; i++) {
            var chevronId = jsonObj.diagram[0].chevrons[0].element[i].elementId;
            var chevronName = jsonObj.diagram[0].chevrons[0].element[i].chevronName;
            var chevronDescription = jsonObj.diagram[0].chevrons[0].element[i].description;
            var positionX = jsonObj.diagram[0].styles[0].format[i].X;
            var positionY = jsonObj.diagram[0].styles[0].format[i].Y;
            var process = jsonObj.diagram[0].chevrons[0].element[i].associatedAsset;
            storePropertiesOfChevron(chevronId, chevronName, chevronDescription, process); //store element properties for each
            var element1 = $('<div>').addClass('chevron');
            var textField = $('<textArea>').attr({
                name: chevronId
            }).addClass("text-edit");
            var descriptorSwitch = $('<div>').addClass('descriptor');
            textField.val(chevronName);
            element1.append(textField);
            element1.append(descriptorSwitch);
            element1.find('.text-edit').position({ // position text box in the center of element
                my: "center",
                at: "center",
                of: element1
            });
            var textFieldTop = 19;
            var textFieldLeft = 40;
            element1.find('.text-edit').attr("readonly", "readonly");
            element1.find('.text-edit').css({
                'top': textFieldTop,
                'left': textFieldLeft,
                'visibility': 'visible',
                'background-color': '#FFCC33'
            });
            element1.css({
                'top': positionY,
                'left': positionX
            });
            $('#canvasArea').append(element1);
            elementList.push({ //store elements to draw connections
                id: chevronId,
                element: element1
            });
            descriptorSwitch.attr('id', chevronId); //set element id for description button
            storeDescriptionsForExistingElements(chevronId, chevronDescription);
            element1.click(chevronClicked);
            // Show description as a popup when clicked
            descriptorSwitch.popover({
                html: true,
                content: function() {
                    var element = $(this);
                    var currentId = element.attr('id');
                    return getDescriptionForElement(currentId);
                }
            }).click(function(e) {
                e.stopPropagation(); //prevent parent click events
            });
        }
        drawConnectionsForElements(); // draw existing connections for all elements
    }

    // draw existing connections for all elements
    function drawConnectionsForElements() {
        if (connections.length != 0) {
            for (var i = 0; i < connections.length; i++) {
                var source = getMatchedElement(connections[i].sourceId);
                var target = getMatchedElement(connections[i].targetId);
                var p0 = connections[i].sourceAnchor1;
                var p1 = connections[i].sourceAnchor2;
                var p2 = connections[i].orientation1;
                var p3 = connections[i].orientation2;
                var p4 = connections[i].targetAnchor1;
                var p5 = connections[i].targetAnchor2;
                var p6 = connections[i].orientation3;
                var p7 = connections[i].orientation4;
                var common = {
                    isTarget: true,
                    isSource: true,
                    maxConnections: -1,
                    connector: ["Flowchart"],
                    connectorStyle: {
                        strokeStyle: "#5c96bc",
                        lineWidth: 1,
                        outlineColor: "transparent",
                        outlineWidth: 4
                    },

                    anchor: [
                        [p0, p1, p2, p3],
                        [p4, p5, p6, p7]
                    ],
                    endpoint: ["Dot", {
                        radius: 4
                    }]
                };
                jsPlumb.connect({
                    source: source,
                    target: target,
                    paintStyle: {
                        strokeStyle: "#5c96bc",
                        lineWidth: 1
                    },
                    overlays: [
                        ["Arrow", {
                            width: 10,
                            length: 10,
                            foldback: 1,
                            location: 1,
                            id: "arrow"
                        }]
                    ],
                    endpointStyle: {
                        fillStyle: "transparent"
                    }
                }, common);
            }
        }
    }

    //show/hide connections on toggle
    $("#connectionVisibility").click(function() {
        if ($.trim($(this).text()) === 'Hide Connections') {
            $('.chevron').each(function(index) {
                jsPlumb.hide(this.id, true);
            });
            $(this).text('Show Connections');
        } else {
            $('.chevron').each(function(index) {
                jsPlumb.show(this.id, true);
            });
            $(this).text('Hide Connections');
        }
        return false;
    });
    //return element for  given id
    function getMatchedElement(id) {
        for (var i = 0; i < elementList.length; i++) {
            if (elementList[i].id == id) {
                elementList[i].element.attr('id', id);
                return elementList[i].element;
            }
        }
    }

    //Replace process name as a linked value
    function replaceProcessText(processName) {
        $.ajax({
            type: "GET",
            url: "../apis/processes?type=process",
            data: {
                q: processName
            },
            success: function(Result) {
                setIdOfProcess(Result, processName);
            }
        });
    }

    // set the id for the given process
    function setIdOfProcess(results, processName) {
        var obj = eval("(" + results + ")");
        for (var i in obj) {
            var item = obj[i];
            processId = item.id;
        }
        $("#td_mod").append('<li><a href = ../../../assets/process/details/' + processId + '>' + processModel + '</a></li>');
    }

    //Store properties of each chevron element
    function storePropertiesOfChevron(id, name, description, process) {
        if (process == '' || process == null) {
            process = "None";
        }
        chevronProperties.push({
            id: id,
            name: name,
            description: description,
            process: process
        });
    }

    // On click of chevron element list table details
    function chevronClicked() {
        $("#td_mod").html("");
        $("#viewElementProps").show();
        var clickedElement = $(this);
        var id = clickedElement.find('.text-edit').attr('name');
        $("#viewMainProps").hide();
        for (var i = 0; i < chevronProperties.length; i++) {
            if (id == chevronProperties[i].id) {
                name = chevronProperties[i].name;
                description = chevronProperties[i].description;
                processModel = chevronProperties[i].process;
                $("#td_name1").html(name);
                $("#td_description").html(description);
                if (processModel == "not declared") {
                    $("#td_mod").html("None");
                } else if (processModel == "None") {
                    $("#td_mod").html("None");
                } else {
                    // set id and name of process as a link
                    replaceProcessText(processModel);
                }
            }
        }
    }
});