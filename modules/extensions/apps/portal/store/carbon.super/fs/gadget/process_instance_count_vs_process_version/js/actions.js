var config = {
    type: "bar",
    x : "Process Version",
    highlight : "multi",
    charts : [{type: "bar",  y : "Process Instance Count"}],
    maxLength: 200,
    xAxisAngle:true,
    padding: {"top": 10, "left": 80, "bottom": 150, "right": 0},
    transform:[60,70]
}

var jsonObj = [];

var callbackmethod = function(event, item) {
}

window.onload = function() {
    $.getJSON("/portal/store/carbon.super/fs/gadget/process_instance_count_vs_process_version/js/meta-data.json.js", function(result){
        $.each(result, function(i, field) {
            jsonObj.push(field);
            loadProcessKeyList("processInstanceCountProcessVersionProcessList");
        });
    });

}

function drawProcessInstanceCountVsProcessVersionResult() {

    var processKey = $('#processInstanceCountProcessVersionProcessList').val();
    if (processKey != '') {
        var body = {
            'processKey': processKey,
            'order': $('#processInstanceCountProcessVersionOrder').val(),
            'count': parseInt($('#processInstanceCountProcessVersionCount').val())
        };

        $.ajax({
            url: '../../bpmn-analytics-explorer/process_instance_count_vs_process_version',
            type: 'POST',
            data: {'filters': JSON.stringify(body)},
            success: function (data) {
                // console.log(data);
                var responseJsonArr = [];
                if (!$.isEmptyObject(data))
                    responseJsonArr = JSON.parse(data);

                var responseStr = '';
                for (var i = 0; i < responseJsonArr.length; i++) {
                    var temp = '["' + responseJsonArr[i].processVer + '",' + responseJsonArr[i].processInstanceCount + '],';
                    responseStr += temp;
                }
                responseStr = responseStr.slice(0, -1);
                var jsonArrObj = JSON.parse('[' + responseStr + ']');
                jsonObj[0].data = jsonArrObj;

                config.width = $('#chartA').width();
                config.height = $('#chartA').height();
                var barChart = new vizg(jsonObj, config);
                barChart.draw("#chartA", [{type: "click", callback: callbackmethod}]);
            },
            error: function (xhr, status, error) {
                var errorJson = eval("(" + xhr.responseText + ")");
                alert(errorJson.message);
            }
        });
    }
}

function loadProcessKeyList(dropdownId) {
    var dropdownElementID = '#' + dropdownId;
    var url = "../../bpmn-analytics-explorer/process_key_list";
    $.ajax({
        type: 'POST',
        url: url,
        success: function (data) {
            var dataStr = JSON.parse(data);
            if (!$.isEmptyObject(dataStr)) {
                for (var i = 0; i < dataStr.length; i++) {
                    var opt = dataStr[i].processKey;
                    var el = document.createElement("option");
                    el.textContent = opt;
                    el.value = opt;
                    $(dropdownElementID).append(el);
                }
                drawProcessInstanceCountVsProcessVersionResult();
            }
        },
        error: function (xhr, status, error) {
            var errorJson = eval("(" + xhr.responseText + ")");
            alert(errorJson.message);
        }
    });
}
