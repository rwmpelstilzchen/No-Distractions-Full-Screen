//No Distractions Full Screen v4.0
//var url = '';
url = decodeURIComponent(url);
scripts = `
<script>
	function pycmd(a){parent.pycmd(a)};
	function finishedLoad(){parent.finishedLoad()};
	pycmd('NDFS-iFrame-DOMReady');
</script>
`;
scriptsDummy = `
<script>
	function pycmd(a){};
	function finishedLoad(){};
	parent.pycmd('NDFS-iFrameDummy-DOMReady')
</script>
`;

if (!$('#bottomiFrame').length){
	$('body').append(`

	  <div id='outer'>
	    <div class="bottomWrapper">
	      <iframe id='bottomiFrame' frameborder="0" scrolling="no"">
	      </iframe>
	      <div id = 'cover'></div>
	    </div>
	      <iframe id='bottomiFrameBkgnd' frameborder="0" scrolling="no"">
	      </iframe>
  		<div id='bottomHover'></div>
	  </div>


	<style>
	#bottomHover {
	    position: fixed;
	    width:100%;
	    height: 15px;
	    bottom: 0px;
	    left: 0px;
	    //background-color: red;
	    z-index: -1;
	}
	
	#outer{
	  bottom: 0;
	  position: fixed;
	  left: 50%;
	  //z-index: -10;
	}
	
	#cover{
		position: absolute;
		top: 0;
		height: 100%;
		width: 100%;
    	//background-color: hotpink;
	}

	.bottomWrapper {
	  position: relative;
	  left: -50%;
	  border-radius: 5px;
	  margin: 0px;
	  pointer-events: auto;
	  touch-action: none;
	  user-select: none;
	  overflow: hidden;
	  //background-color: purple;
	}
	
	#bottomiFrame {
	  display:block;
	  margin: 0px;
	  position: absolute;
	  overflow: hidden;
	  bottom: 0;
	  user-select: none;
	  z-index: -1;
	}

	#bottomiFrameBkgnd {
	  //background-color: yellow;
	  display:block;
	  margin: 0px;
	  position: fixed;
	  bottom: 0;
	  left: 0;
	  width: 100%;
	  user-select: none;
	  touch-action: none;
	  pointer-events: none;
	  //z-index: -2;
	}
	</style>
	`);
}
$("#cover").hide(); //cover only shown when dragging iframe
$("#bottomiFrame").attr("srcdoc", url + scripts);
$("#bottomiFrameBkgnd").attr("srcdoc", url + scriptsDummy); // no communication with python

function scriptExec(js) { 
	js = decodeURIComponent(js) //% encoded
	if (js.includes('<<<FOR BKGND>>>')){
		val = $('#bottomiFrameBkgnd')[0].contentWindow.eval(js);
	}
	else if (js.includes('<<<FOR ACTUAL>>>')){
		val = $('#bottomiFrame')[0].contentWindow.eval(js);
	}
	else {
		val = $('#bottomiFrame')[0].contentWindow.eval(js);
		$('#bottomiFrameBkgnd')[0].contentWindow.eval(js);
	}
	return val
}