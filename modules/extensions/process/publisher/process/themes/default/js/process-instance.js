/**
 * Created by dimuth on 8/23/16.
 */
function getInstnace() {
    $.ajax({
        url: '/designer/assets/process/apis/instance',
        type: 'GET',
        async: false,
        success: function (data) {
            window.alert(data);
            var response = JSON.parse(data);
            if (response.error === false) {
                processTagsObj = JSON.parse(response.content);
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
