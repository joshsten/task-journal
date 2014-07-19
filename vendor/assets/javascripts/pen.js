/*
 Normalized Events Offered
 * -------------------------
 * paste(event, pastedValue)
 * keyPress (event)
 * keyUp (event)
 * keyDown(event)
 * textSelected(event, range)
 * 	range.text
 * 	range.startOffset
 * 	range.endOffset
 * 	range.startContainer
 * 	range.endContainer
 * 	range.selectionContainer // This can be used for attaching floating pens
 */


$(window).load(function(){
	$('pen').pen();	
});

window.pen = window.pen || {};

$.fn.pen = (function($, pen){
	// Global
	var penWithFocus = null;
	var penGlobal = {};

	$(document)
	.mousemove(function(){
		penGlobal.mousePosition = pen.helper.getMousePosition();
	})
	.keypress(function(e){
		if (e.which !== 0 && penWithFocus){
			var character = String.fromCharCode(e.which);
			penWithFocus.events.keyPress({character: character, shift: false, ctrl: false, alt: false});
		}
		penWithFocus.$pen.$proxy.val(''); // Clean this out. We need to keep it empty for pasting.
	}).keydown(function(e){
		switch(e.keyCode){
			case 8:
				penWithFocus.events.backspacePushed();
				e.preventDefault();
			break;	
		}
	});

	// posx and posy contain the mouse position relative to the document
	return function(){ // Instance
		var $thisPen = $(this);
		var context = {
			$pen : $thisPen,
			events:{
				keyPress: function(keys){
					pen.helper.typeCharacter($thisPen, keys.character);
				},
				backspacePushed: function(){
					pen.helper.removeCharacterBeforeCursor($thisPen);
				}
			}
		};

		var init = function(){
			var $textProxy = $('<textarea/>');
			$('body').append($textProxy);
			var rect = $thisPen[0].getBoundingClientRect();

			$textProxy.css({
				position: 'absolute',
				width: rect.right-rect.left,
				height: rect.bottom - rect.top,
				left: rect.left,
				top: rect.top,
				opacity: 0
			});
		
			$thisPen.$proxy = $textProxy;
			bindUx();	
		};

		$(penGlobal).bind('unsetcursor', function(){
			pen.helper.unsetCursor($thisPen);
		});

		function bindUx(){
		
		$thisPen.$proxy.mouseenter(function(){
			$thisPen.addClass('hover');
		});
		$thisPen.$proxy.mouseout(function(){
			$thisPen.removeClass('hover');
		});
		$thisPen.$proxy.blur(function(){
			pen.helper.unsetCursor($thisPen);
		});
		
		$thisPen.add($thisPen.$proxy).click(function(){
			penWithFocus = context;
			var target;
			if (!e) var e = window.event;
			if (e.target) target = e.target;
			else if (e.srcElement) target = e.srcElement;
			if (target.nodeType == 3) // defeat Safari bug
				target = target.parentNode;
			
			if (this === target){
				pen.helper.setCursor($thisPen, penGlobal.mousePosition);
			}
		});
		
		$thisPen.$proxy.on('paste', function(e){
			$thisPen.$proxy.val('');
			setTimeout(function(){
				pen.helper.insertText($thisPen, $thisPen.$proxy.val());
				$thisPen.trigger('paste', [e, $thisPen.$proxy.val()]);
				$thisPen.$proxy.val('');
			},4);
		});
		
		};

		$thisPen.delegate('char','click', function(e){
			penWithFocus = context;

			pen.helper.setCursor($(this),e);

		});

		init();
	}
}($, pen));
