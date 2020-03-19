//No Distractions Full Screen v3.2
//Uses interact.js

var target;
var currX;
var currY;
var currLock;
var currHover;
var currDrag = false;

function getTarget(){
  target = document.querySelector('div.bottomWrapper');
}

//called when screen updates
var timeout = false;
$("body").on('DOMSubtreeModified', 'td#middle', function() {
  getTarget();
  if(target != null && !timeout){
    timeout = true;
    updatePos(currX, currY);
    activateHover();
    if (currLock){
      disable_drag();
    }
    else {
      enable_drag();    
    }
    if (currHover){
      fade_in(target);
    }
    setTimeout(function(){ timeout = false; }, 5); //prevents overzealous updates, since selector grabs multiple events per card change
  }
});

//moves target to within window boundaries
function fitInWindow() {
  getTarget()
  if (target !== null){
    var rect = target.getBoundingClientRect();
    var x = parseFloat(target.getAttribute('data-x'));
    var y = parseFloat(target.getAttribute('data-y'));
    if (rect.x < 0){
      updatePos(x - rect.x, y)
    }
    if (rect.right > window.innerWidth){
      dx = rect.right - window.innerWidth
      updatePos(x - dx , y)
    }
    if (rect.top < 0){
      updatePos(x, y - rect.top )
    }
    if (rect.bottom > window.innerHeight){
      dy = rect.bottom - window.innerHeight
      updatePos(x, y - dy )
    }
  }
}

$(window).resize(function() {
  fitInWindow();
});

function updatePos(x, y){
  getTarget()
  target.style.transform = 'translate(' + (parseFloat(x) || 0) + 'px, ' + (parseFloat(y) || 0) + 'px)';
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
  currX = x;
  currY = y;
}

function enable_drag(){
  getTarget()
  fitInWindow()
  if (!interact.isSet(target)){
    interact(target)
      .draggable({
        inertia: true,
        enabled: true,
        modifiers: [
            interact.modifiers.restrictRect({
              restriction: 'div.bottomWrapper',
              endOnly: true
            }),
              interact.modifiers.snap({
                targets: [
              function () { //recursively calculates target original position (before transform)
              var el = target, offsetLeft = 0, offsetTop  = 0;
              do{
                  offsetLeft += el.offsetLeft;
                  offsetTop  += el.offsetTop;
                  el = el.offsetParent;
              } while( el );
                return {
                  x: offsetLeft, //snap target
                  y: offsetTop,
                  range: 50, //snap 'stickiness'
                }
              }
                ],
              relativePoints: [
              { x: 0, y: 0} //snap to top-left
            ]
              })
        ],
        autoScroll: false,
        onstart: function() {
          currDrag = true;
        },
        onmove: dragMoveListener,
        onend: function (event) {
          var x = event.target.getAttribute('data-x');
          var y = event.target.getAttribute('data-y');
          pycmd("NDFS-draggable_pos: " + x + ", " + y);
          currX = x;
          currY = y;
          currDrag = false;
        }
      })
  }
  else {
      interact(target).draggable({enabled: true})
  }
  $(target).css({'-webkit-box-shadow': '0 0 10px LightBlue'});
  currLock = false;
}

function dragMoveListener (event) {
  var target = event.target
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
  // translate the element
  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
  //console.log(x +', '+ y)
}

function disable_drag(){
  getTarget();
  fitInWindow();
  interact(target).unset();
  //interact(target).draggable({enabled: false}); //Will occasionally stop working if disabled - better to unset
  $(target).css({'-webkit-box-shadow': '', 'border': ''});
  currLock = true;
}

var mousedown = false;
function activateHover(){
  getTarget();
  $(target).on({
      mouseenter: function(){
        fade_in(target);
      },
      mouseleave: function(){
        fade_out(target)
      },
      touchstart: function(){
        fade_in(target);
      },
      touchend: function(){
        //console.log('touchend')
        fade_out(target)
      }
  });
}

function enable_bottomHover(){
  getTarget();
  $("#bottomHover").on({
    mouseenter: function(){
      fade_in(target);
    },
    mouseleave: function(){
      fade_out(target);
    }
  });
}

function fade_in(target){
  if (!currDrag) { //prevents changes when dragging
    $(target).css('animation-direction','normal');
    $(target).addClass('fade-in');
    $(target).css('opacity','1');  
    $(target).on("animationend", function(){
      $(this).removeClass('fade-in');
      });
    currHover = true;
  }
}

function fade_out(target){
  if (!currDrag) { //prevents changes when dragging
    $(target).css('animation-direction','reverse');
    $(target).addClass('fade-in');
    $(target).css('opacity','');  
    $(target).on("animationend", function(){
      $(this).removeClass('fade-in');
      });
    currHover = false;
  }
}