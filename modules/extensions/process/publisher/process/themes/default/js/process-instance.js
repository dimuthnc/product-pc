/**
 * Created by dimuth on 8/23/16.
 */
function getInstance() {

    $.ajax({
        url: '/designer/assets/process/apis/instance',
        type: 'GET',
        async: false,
        success: function (data) {


            var response = JSON.parse(data);

            if (response.error === false) {


                processTagsObj = JSON.parse(response.content);
                window.alert(processTagsObj[0].ProcessID);
                var table= document.getElementById('dataTable');
                for (i = 0; i < processTagsObj.length; i++) {




                    var row = table.insertRow(1);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4= row.insertCell(3);
                    cell1.innerHTML = processTagsObj[i].InstanceID;
                    cell2.innerHTML = processTagsObj[i].ProcessID;
                    cell3.innerHTML = processTagsObj[i].StartTime;
                    cell4.innerHTML = '<Button>View More</Button>';



                }
                table.insertAdjacentHTML('beforeend',
                    '</table>');



            } else {
                alertify("inside Else");
                alertify.error(data);
            }
        },
        error: function (data) {

            window.alert(data.error);


            alert.error('Process tag list returning error');
        }
    });

}
