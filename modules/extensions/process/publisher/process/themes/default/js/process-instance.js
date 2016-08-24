/**
 * Created by dimuth on 8/23/16.
 */
function getInstance() {
    $.ajax({
        url: '/designer/assets/process/apis/instance',
        type: 'GET',
        async: false,
        success: function (data) {
            window.alert('here');

            var response = JSON.parse(data);

            if (response.error === false) {
                processTagsObj = JSON.parse(response.content);
                window.alert(processTagsObj[0].ProcessID);
                var table= document.getElementById('dataTable');
                for (i = 0; i < 3; i++) {
                    window.alert("here");

                    table.insertAdjacentHTML('beforeend','<tr><td >');


                    table.insertAdjacentHTML('beforeend','<tr><td >');
                    table.insertAdjacentHTML('beforeend',processTagsObj[i].InstanceID);
                    table.insertAdjacentHTML('beforeend','</td><td>');
                    table.insertAdjacentHTML('beforeend',processTagsObj[i].ProcessID);
                    table.insertAdjacentHTML('beforeend','</td><td>');
                    table.insertAdjacentHTML('beforeend','Time');
                    table.insertAdjacentHTML('beforeend','</td><td>');
                    table.insertAdjacentHTML('beforeend','</td></tr>');

                }
                table.insertAdjacentHTML('beforeend',
                    '</table>');

                var tagStr = "";
                if ($("#pName").val() != "" && $("#pVersion").val() != "") {
                    var path = "/processes/"+$("#pName").val()+"/" +$("#pVersion").val()
                    for (var key in processTagsObj) {

                        if (processTagsObj.hasOwnProperty(key)) {
                            var processObj = processTagsObj[key];
                            if(processObj[0].path=== path){
                                tagStr += key+",";
                            }
                        }
                    }
                    $('#tag-box').val(tagStr);
                }
            } else {
                alertify("inside Else");
                alertify.error(response.content);
            }
        },
        error: function () {
            alert.error('Process tag list returning error');
        }
    });
}
