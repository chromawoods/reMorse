/**
 * reMorse - Translates text to morse code.
 * Script home: https://github.com/chromawoods/reMorse/
 * Author: Andreas Larsson
 * Contact: andreas@chromawoods.com
 */
var reMorse = (function (window) {

/* Constants
 *****************************/
	var APPNAME = 'reMorse',
	
		DEBUG = false,
		
		MORSE_TYPES = [
			{ type : 'international', description : 'International (ITU)' }
		],
		
		DEFAULTS = {
			morseType : 'international',
			shortSymbol : '&bull;',
			longSymbol : '&ndash;',
			charSeparator : '|',
			wordSeparator : ' ',
			wordBefore : '',
			wordAfter : ''
		};


/* Vars
 *****************************/
	var settings = DEFAULTS,
		lastMsg = '',
		lastConversion = '';


/* Internal functions
 *****************************/
 
	/*
	 * Logs a message to the console if in debug mode.
	 */
	var log = function (msg, severity) {
		DEBUG && console[severity || 'log'](APPNAME + ': ' + msg);
	};
	
	
	/*
	 * Returns an array of characters with their morse equivalent.
	 */
	var getCharSet = function (type) {
		log('Char set type "' + type + '" provided.');
		switch (type) {
			case 'wabun' : return [];
			default : 
				log('Getting default char set (' +  DEFAULTS.morseType + ')');
				return [
					{ human : 'a', morse : 'sl' },
					{ human : 'b', morse : 'lsss' },
					{ human : 'c', morse : 'lsls' },
					{ human : 'd', morse : 'lss' },
					{ human : 'e', morse : 's' },
					{ human : 'f', morse : 'ssls' },
					{ human : 'g', morse : 'lls' },
					{ human : 'h', morse : 'ssss' },
					{ human : 'i', morse : 'ss' },
					{ human : 'j', morse : 'slll' },
					{ human : 'k', morse : 'lsl' },
					{ human : 'l', morse : 'slss' },
					{ human : 'm', morse : 'll' },
					{ human : 'n', morse : 'ls' },
					{ human : 'o', morse : 'lll' },
					{ human : 'p', morse : 'slls' },
					{ human : 'q', morse : 'llsl' },
					{ human : 'r', morse : 'sls' },
					{ human : 's', morse : 'sss' },
					{ human : 't', morse : 'l' },
					{ human : 'u', morse : 'ssl' },
					{ human : 'v', morse : 'sssl' },
					{ human : 'w', morse : 'sll' },
					{ human : 'x', morse : 'lssl' },
					{ human : 'y', morse : 'lsll' },
					{ human : 'z', morse : 'llss' },
					{ human : '0', morse : 'lllll' },
					{ human : '1', morse : 'sllll' },
					{ human : '2', morse : 'sslll' },
					{ human : '3', morse : 'sssll' },
					{ human : '4', morse : 'ssssl' },
					{ human : '5', morse : 'sssss' },
					{ human : '6', morse : 'lssss' },
					{ human : '7', morse : 'llsss' },
					{ human : '8', morse : 'lllss' },
					{ human : '9', morse : 'lllls' }
				];
		}
	};
	
	
	/*
	 * Main function for returning a converted message.
	 */
	var getConvertion = function (str, morseType) {
		log('-> msgConv');
	
		str = str.replace(/\n/g, ' '); // Replace newlines with spaces.
	
		var diffTime, newChar,
			startTime = (new Date).getTime(),
			convStr = '',
			strL = str.toLowerCase(),
			prevChar = false,
			chars = getCharSet(settings.morseType),
			numMapChars = chars.length,
			numMsgChars = str.length,
			symbolMap = {
				s : settings.shortSymbol,
				l : settings.longSymbol
			};
		
		log('Converting...');
		
		for (var i = 0; i < numMsgChars; i++) {
			newChar = '';
			for (var j = 0; j < numMapChars; j++) {
				if (chars[j].human === strL.charAt(i)) {
					newChar = chars[j].morse;
				}
			}
			
			if (newChar) {
				newChar = newChar.replace(/s|l/g, function (match) { 
					return symbolMap[match];
				});
			} else { // Morse equivalevt not found - use whatever character was provided.
				newChar = str.charAt(i);
			}
			
			if (prevChar && prevChar !== ' ') {
				convStr += settings.charSeparator;
			}
			
			convStr += (!prevChar || prevChar === ' ')
				? settings.wordBefore + newChar // A new word starts.
				: (i < numMsgChars && str.charAt(i+1) === ' ') 
					? newChar + settings.wordAfter + settings.wordSeparator // A word ends, another will follow.
					: (i === numMapChars)
						? newChar + settings.wordAfter // Last word ends.
						: newChar; // Nothing special, just concat the char.
			
			prevChar = newChar;
		}

		lastConversion = convStr;
		diffTime = (new Date).getTime() - startTime;
		log('Done in ' + diffTime + 'ms.');
		return convStr;
	};


/* Returns
 *****************************/
	return function (msg, opts) {
	
		// No arguments provided; return some properties and methods instead.
		if (!arguments.length) {
			return {
				morseTypes : MORSE_TYPES,
				
				setMorseType : function (type) {
					log('reMorse().setMorseType');
					for (var i = 0; i < MORSE_TYPES.length; i++) {
						if (MORSE_TYPES[i].type === type) {
							log('Setting morse type (' + type + ').');
							settings.morseType = type;
							return true;
						}
					}
					log('Invalid morse type.');
					return false;
				}
			};
		}
		
		log('Will attempt to convert.');
		
		if (!msg || typeof msg !== 'string') {
			log('Empty or faulty string.');
			lastMsg = '';
			return lastMsg;
		} else if (msg === lastMsg) {
			log('Nothing to convert.');
			return lastConversion;
		}

		lastMsg = msg;
		
		// Assemble options.
		if (typeof opts === 'object') {
			for (var opt in opts) {
				if (settings.hasOwnProperty(opt)) {
					settings[opt] = opts[opt];
				}
			}
		}
		
		return getConvertion(msg, settings.morseType);
	};

})(this);