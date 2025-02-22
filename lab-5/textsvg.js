"use strict";

function generateWedge(startX, startY, startAngle, endAngle, radius){
    // Getting the angles and coordinates
    var x1 = startX + radius * Math.cos(Math.PI * startAngle/180);
    var y1 = startY + radius * Math.sin(Math.PI * startAngle/180);
    var x2 = startX + radius * Math.cos(Math.PI * endAngle/180);
    var y2 = startY + radius * Math.sin(Math.PI * endAngle/180);

    // Getting the SVG info
    var pathString = "M" + startX + " " + startY + " L" + x1 + " " + y1 + " A" + radius + " " + radius + " 0 0 1 " + x2 + " " + y2 + " z";

    return pathString;
}
