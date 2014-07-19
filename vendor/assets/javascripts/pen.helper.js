window.pen = window.pen || {};
	pen.helper = (function($){
		'use strict';

		var config = {
			selector:{
				cursor: 'cursor'
			},
			markup:{
				cursor: '<cursor/>'
			}
		};

		var ns = {};

		ns.setCursorFor = function($this){
			ns.unsetCursor($this.closest('pen'));
			var $cursor = $(config.markup.cursor);


			if ($this.is('char')){
				$this.after($cursor);
			}else if ($this.is('pen')){
				$cursor.addClass('at-end');
				$this.append($cursor);
			}
		};

		ns.setCursor = function($this, mousePosition){
			// Grab all text nodes.
			var textNodes = $this.find('*').contents().filter(function() { 
    				return (this.nodeType == 3); 
			});

			var totalTextLength = 0;
		       	for (var index = 0; index < textNodes.length; index++){
		       		totalTextLength += textNodes[index].length;
		       	}
			

			var getFactsAbout = function($element, x, y){
				var boundingRect = $element[0].getBoundingClientRect();

				var facts = {
					isLeftOfElement: x < boundingRect.left,
					isRightOfElement: x > boundingRect.right,
					horizontallyIntersectsElement: x >= boundingRect.left && x <= boundingRect.right,

					isAboveElement: y < boundingRect.top,
					isBelowElement: y > boundingRect.bottom,
					verticallyIntersectsElement: y >= boundingRect.top && y <= boundingRect.bottom,
				};
				facts.intersectsElement = facts.horizontallyIntersectsElement && facts.verticallyIntersectsElement;
				facts.isPriorToElement = facts.isLeftOfElement && y < boundingRect.bottom || facts.isAboveElement; 
				facts.isAfterElement = !facts.intersectsElement && !facts.isPriorToElement;
				
				return facts;
			}

			var getPositionOfCharacter = function(listOfNodes, index){
				var lengthSoFar = 0;				
				for (var i = 0; i < listOfNodes.length; i++){
					lengthSoFar += listOfNodes[i].length;
					if (lengthSoFar > index){
						return {
							nodeIndex: i,
							characterIndex: listOfNodes[i].length - (lengthSoFar - index)
						};		
					}
				}
			}

			var getWrappedCharacter = function(listOfNodes, index, wrapper){
				var pos = getPositionOfCharacter(listOfNodes, index);
				if (!pos)
				{
					return false;
				}
				if (pos.characterIndex > 0){
					listOfNodes[pos.nodeIndex].splitText(pos.characterIndex-1);
				}
				if (listOfNodes[pos.nodeIndex].nextSibling){
					listOfNodes[pos.nodeIndex].nextSibling.split(1);
				}
				if (pos.characterIndex === 0){
					return $(listOfNodes[pos.nodeIndex]).wrap(wrapper).parent();
				}else{
					return $(listOfNodes[pos.nodeIndex].nextSibling).wrap(wrapper).parent();
				}
			};
			
			var normalize = function(listOfNodes){
				for (var index = 0; index < listOfNodes.length; index++){
					listOfNodes[index].normalize();
				}
			};


			var getIntersectedCharacter = function(listOfNodes, mouseX, mouseY, checkIndex, length){
				if (!length){
					return false;
				}
				var $wrappedElement = getWrappedCharacter(listOfNodes, checkIndex, "<char/>");
				var facts = getFactsAbout($wrappedElement, mouseX, mouseY);

				if (facts.intersectsElement){
					normalize(listOfNodes); // Clean up all of the split nodes.
					return $wrappedElement;
				}else if(facts.isAfterElement){
					$wrappedElement.replaceWith($wrappedElement.contents()); // Cleanup after ourselves
					return getIntersectedCharacter(listOfNodes, mouseX, mouseY, length - Math.floor(checkIndex / 2), length );
				}else{
					$wrappedElement.replaceWith($wrappedElement.contents()); // Cleanup after ourselves
					return getIntersectedCharacter(listOfNodes, mouseX,mouseY, Math.floor(checkIndex/2), length);
				}
			};
		
			var $intersectedCharacter = getIntersectedCharacter(textNodes, mousePosition.x, mousePosition.y, Math.floor(totalTextLength/2), totalTextLength);
			ns.setCursorFor($intersectedCharacter || $this);						
		};
		
		ns.select = function($this, startX, startY, endX, endY){

		};
		
		ns.removeCharacterBeforeCursor = function($penInstance){
			var $cursor =  $penInstance.find('cursor');
			$cursor.prev().remove();
		};	
	
		ns.unsetCursor = function($penInstance){
			$penInstance.find(config.selector.cursor).remove();
		};

		ns.typeCharacter = function($penInstance, character){
			var $cursor =  $penInstance.find('cursor');
			if ($cursor.length){
				if (pen.options.allowMultipleConsecutiveSpaces && character === ' '){
					character = '&nbsp;';
				}
					$cursor.before('<char class="new">' + character+'</char>');
					setTimeout(function(){
					$cursor.prev().removeClass('new').addClass('typed');}, 1);
				
			}else{
				return false;
			}
		};
		ns.insertText = function($penInstance, text){
			var $cursor =  $penInstance.find('cursor');
			$cursor.before(text);	
		};
		ns.getMousePosition = function(){
			var posx = 0;
			var posy = 0;
			if (!e) var e = window.event;
			if (e.pageX || e.pageY) 	{
				posx = e.pageX;
				posy = e.pageY;
			}
			else if (e.clientX || e.clientY) 	{
				posx = e.clientX + document.body.scrollLeft
					+ document.documentElement.scrollLeft;
				posy = e.clientY + document.body.scrollTop
					+ document.documentElement.scrollTop;
			}
			return {x: posx, y: posy};
		};

		return ns;
	}($));	

