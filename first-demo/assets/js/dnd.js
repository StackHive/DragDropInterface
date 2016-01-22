$(function() {
    var clientFrameWindow = $('#clientframe').get(0).contentWindow;
    $("#dragitemslistcontainer li").on('dragstart',function() {
        console.log("Drag Started");
    });
    $("#dragitemslistcontainer li").on('dragend',function() {
        console.log("Drag End");
    });
    $('#clientframe').load(function()
    {
        var total = 0;
        $(clientFrameWindow.document.body).find('*').on('dragenter',function(event)
        {
            event.preventDefault();
            event.stopPropagation();
            console.log('Drag Enter');
            total +=1;
        }).on('dragover',function(event)
        {
            event.preventDefault();
            event.stopPropagation();
            console.log('Drag Over');
            total +=1;
        });

        $(clientFrameWindow.document).find('body,html').on('drop',function(event) {
            event.preventDefault();
            event.stopPropagation();
            console.log('Drop event');
            total +=1;
            console.log("Total Events Fired = "+total);
            total = 0;
        });
    });
});