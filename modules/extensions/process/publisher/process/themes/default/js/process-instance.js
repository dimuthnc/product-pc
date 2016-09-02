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



            k=table.rows.length;
            for(j=1;j<k;j++){
                table.deleteRow(1);

            }




            var response = JSON.parse(data);

            if (response.error === false) {



                processTagsObj = JSON.parse(response.content);




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
                        var jstr = JSON.stringify(variables);

                        var strlink ="/designer/assets/process/instance_variable"+"?vars="+btoa(jstr);




                        cell4.innerHTML = '<a href='+strlink+'>View Process Variables</a>';








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

        window.alert(key);

        var row = table.insertRow(1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);

        cell1.innerHTML = key;
        cell2.innerHTML = vars[key];






        window.alert(vars[key]);





        //var jarray = JSON.parse(jarray);

        //window.alert(atob(pair[1]));


    }
}
