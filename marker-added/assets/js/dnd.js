
var DragAndDropFunctions = {
    GetMouseCoordinates_Percentage : function($element,elementRect,mousePos)
    {
        if(!elementRect)
            elementRect = $element.get(0).getBoundingClientRect();
        var mousePosPercent_X = ((mousePos.x-elementRect.left)/(elementRect.right-elementRect.left))*100;
        var mousePosPercent_Y = ((mousePos.y-elementRect.top) /(elementRect.bottom-elementRect.top))*100;

        return {x:mousePosPercent_X,y:mousePosPercent_Y};
    },
    OrchestrateDragDrop : function($element, elementRect, mousePos)
    {
        //If no element is hovered or element hovered is the placeholder -> not valid -> return false;
        if(!$element || $element.length == 0 || !elementRect || !mousePos || $element.closest('.reserved-drop-marker').length != 0)
            return false;

        //Top and Bottom Area Percentage to trigger different case. [5% of top and bottom area gets reserved for this]
        var breakPointNumber = {x:5,y:5};

        var mousePercents = this.GetMouseCoordinates_Percentage($element,elementRect,mousePos);
        if((mousePercents.x > breakPointNumber.x && mousePercents.x < 100-breakPointNumber.x) && (mousePercents.y > breakPointNumber.y && mousePercents.y < 100-breakPointNumber.y))
        {
            //Case 1 -
            $tempelement = $element.clone();
            $tempelement.find(".reserved-drop-marker").remove();
            if($tempelement.html() == "" && !this.checkVoidElement($tempelement))
            {
                //Empty Element Detected
                if(mousePercents.y < 90)
                    return this.PlaceInside($element);
            }
            else if($tempelement.children().length == 0)
            {
                //Text element detected
                this.DecideBeforeAfter($element,mousePercents);
            }
            else if($tempelement.children().length == 1)
            {
                //Only 1 child element detected
                this.DecideBeforeAfter($element.children(":not(.reserved-drop-marker)").first(),mousePercents);
            }
            else
            {
                //Multiple child elements detected
                var positionAndElement = StackHiveEditor.cssSettings.CommonFunctions.findNearestElement($element,mousePos.x,mousePos.y);
                this.DecideBeforeAfter(positionAndElement.el,mousePercents,mousePos);
            }
        }
        else if((mousePercents.x <= breakPointNumber.x) || (mousePercents.y <= breakPointNumber.y))
        {
            var validElement = null
            if(mousePercents.y <= mousePercents.x)
                validElement = this.FindValidParent($element,'top');
            else
                validElement = this.FindValidParent($element,'left');

            if(validElement.is("body,html"))
                validElement = $("#stackhive_iframe").contents().find("body").children(":not(.reserved-drop-marker)").first();
            this.DecideBeforeAfter(validElement,mousePercents,mousePos);
        }
        else if((mousePercents.x >= 100-breakPointNumber.x) || (mousePercents.y >= 100-breakPointNumber.y))
        {
            var validElement = null
            if(mousePercents.y >= mousePercents.x)
                validElement = this.FindValidParent($element,'bottom');
            else
                validElement = this.FindValidParent($element,'right');

            if(validElement.is("body,html"))
                validElement = $("#stackhive_iframe").contents().find("body").children(":not(.reserved-drop-marker)").last();
            this.DecideBeforeAfter(validElement,mousePercents,mousePos);
        }
    }
};
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
        //Add CSS File to iFrame
        var style = $("<style data-reserved-styletag></style>").html(GetInsertionCSS());
        $(clientFrameWindow.document.body).append(style);
        var total = 0;
        $(clientFrameWindow.document.body).find('*').on('dragenter',function(event)
        {
            event.preventDefault();
            event.stopPropagation();
            console.log('Drag Enter');
            total +=1;
        })
        $(clientFrameWindow.document.body).find('*').on('dragover',function(event)
        {
            event.preventDefault();
            event.stopPropagation();
            $(clientFrameWindow.document.body).find('.reserved-drop-marker').remove();
            $(event.target).append("<p class='reserved-drop-marker'></p>");
            console.log('Drag Over');
            total +=1;
        })

        $(clientFrameWindow.document).find('body,html').on('drop',function(event) {
            event.preventDefault();
            event.stopPropagation();
            console.log('Drop event');
            total +=1;
            console.log("Total Events Fired = "+total);
            total = 0;
        });
    });



    GetInsertionCSS = function()
    {
        var styles = ""+
            ".reserved-drop-marker{width:100%;height:2px;background:#00a8ff;position:relative}.reserved-drop-marker::after,.reserved-drop-marker::before{content:'';background:#00a8ff;height:7px;width:7px;position:absolute;border-radius:50%;top:-2px}.reserved-drop-marker::before{left:0}.reserved-drop-marker::after{right:0}";

        return styles;
    }
});