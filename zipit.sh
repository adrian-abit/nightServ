#!/bin/bash
echo -e "minimizing style.css..."
cleancss -v -o smaller.css style.css
echo -e "done"
echo -e "zipping..."
zip ../nightServ.zip addon.js content.js dark.css darker.css manifest.json N.svg nightserv.svg nightservfull.svg nightservN*.png popup.html popup.js smaller.css
