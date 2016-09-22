/**
 * Created by dimuth on 8/23/16.
 */
function getInstance() {
    $.ajax({
        url: '/designer/assets/process/apis/instance',
        type: 'GET',
        async: false,
        success: function (data) {
            var table= document.getElementById('dataTable');
            var deploymentID = document.getElementById("DeploymentID").value;
            var AllVarList=[];


            k=table.rows.length;
            for(j=1;j<k;j++){
                table.deleteRow(1);

            }
            var table2= document.getElementById('allVars');

            for(j=0 ;  j<table2.rows.length ;  j++){
                var rowValue = table2.rows[j].cells[0].innerHTML;
                AllVarList.push(rowValue);
                //window.alert(rowValue);
            }




            var response = JSON.parse(data);

            if (response.error === false) {


                var varList = document.getElementById("varList").value;

                processTagsObj = JSON.parse(response.content);




                //log.info(page.processVariableList);

                for (i = 0; i < processTagsObj.length; i++) {
                    if(deploymentID==processTagsObj[i].ProcessID){
                        var row = table.insertRow(1);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4= row.insertCell(3);
                        cell1.innerHTML = processTagsObj[i].InstanceID;
                        cell2.innerHTML = processTagsObj[i].ProcessID;
                        cell3.innerHTML = processTagsObj[i].CreatedDate;
                        var variables = processTagsObj[i].Variables;



                        var avaList=Object.keys(variables[0]);
                        var finalList ={};

                        for(var n in AllVarList){
                            if(avaList.indexOf(AllVarList[n])==-1){

                                variables[0][AllVarList[n]] = null;


                            }
                            //  window.alert(page);

                            var jstr = JSON.stringify(variables);
                            var strlink ="/designer/assets/process/instance_variable"+"?vars="+btoa(jstr);




                            cell4.innerHTML = '<a href='+strlink+'>View Process Variables</a>';








                        }

                    }





                }







            } else {

                alertify.error(data);
            }
        },
        error: function (data) {


            alert.error('Instance list returning error');
        }
    });

}



function getInstanceVariables(){


    var query = window.location.search.substring(1);
    var pair = query.split("=");
    var jarray = atob(pair[1]);
    var jarry = JSON.parse(jarray);
    var table= document.getElementById('varTable');

    var vars = jarry[0];


    k=table.rows.length;
    for(j=1;j<k;j++){
        table.deleteRow(1);

    }

    for (var key in vars) {


        var row = table.insertRow(1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);

        cell1.innerHTML = key;
        if (vars[key] == null) {

            cell2.innerHTML = "<a onclick=\"predictValue()\">Predict</a>";

        }
        else {
            cell2.innerHTML = vars[key];
        }


        //var jarray = JSON.parse(jarray);

        //window.alert(atob(pair[1]));
    }
}

function predictValue(){

    var table2= document.getElementById('varTable');
    var modelId= document.getElementById('modelIdField').value;
    var analysisId= document.getElementById('analysisIdField').value;
    var varNames=[];
    var varValues=[];
    k2= table2.rows.length;
    for(u=1;u<k2;u++){
        var cellvalue =table2.rows[u].cells[1].innerHTML;
        var tagstart = cellvalue.substring(0,2);
        var tagEnd = cellvalue.substring(cellvalue.length-2,cellvalue.length+1)

        if(!(tagstart=="<a" && tagEnd=="a>" )){


            varNames.push(table2.rows[u].cells[0].innerHTML);
            varValues.push(table2.rows[u].cells[1].innerHTML);
        }


    }

    $.ajax({
        url: '/designer/assets/process/apis/predict_variable',
        type: 'POST',
        data: {'varNames': JSON.stringify(varNames),'varValues':JSON.stringify(varValues),'modelId':JSON.stringify(modelId),'analysisId':JSON.stringify(analysisId)},
        async: false,
        success: function (response) {
            var responseJSON = JSON.parse(response);
            var content = responseJSON.content;
            var error = responseJSON.error;



            if (error== "true") {
                alertify.error(' variables predicting error');
                returnValue = "ERROR";
                callback(returnValue);
            } else {
                alert("Prediced Value  :" + content);

                returnValue = "SUCCESS";
                callback(returnValue);
            }
        },
        error: function (response) {
            alertify.error('api calling error');
            returnValue = "ERROR";
            callback1(returnValue);
        }
    });
}
