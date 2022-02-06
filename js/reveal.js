;(function(window) {

	'use strict';

	function extend(a, b) {
		for(var key in b) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	function RevealFx(el, options) {
		this.el = el;
		this.options = extend({}, this.options);
		extend(this.options, options);
	}


	RevealFx.prototype.options = {
		isContentHidden: true,
		revealSettings: {
			direction: 'lr',
			bgcolor: '#f0f0f0',
			duration: 500,
			easing: 'easeInOutQuint',
			coverArea: 0,
			onCover: function(contentEl, revealerEl) { return false; },
			onStart: function(contentEl, revealerEl) { return false; },
			onComplete: function(contentEl, revealerEl) { return false; }
		}
	};


	RevealFx.prototype._getTransformSettings = function(direction) {
		var val, origin, origin_2;

		switch (direction) {
			case 'lr' : 
				val = 'scale3d(0,1,1)';
				origin = '0 50%';
				origin_2 = '100% 50%';
				break;
			case 'rl' : 
				val = 'scale3d(0,1,1)';
				origin = '100% 50%';
				origin_2 = '0 50%';
				break;
			case 'tb' : 
				val = 'scale3d(1,0,1)';
				origin = '50% 0';
				origin_2 = '50% 100%';
				break;
			case 'bt' : 
				val = 'scale3d(1,0,1)';
				origin = '50% 100%';
				origin_2 = '50% 0';
				break;
			default : 
				val = 'scale3d(0,1,1)';
				origin = '0 50%';
				origin_2 = '100% 50%';
				break;
		};

		return {
			val: val,
			origin: {initial: origin, halfway: origin_2},
		};
	};


	RevealFx.prototype.reveal = function(revealSettings) {
		if( this.isAnimating ) {
			return false;
		}
		this.isAnimating = true;
		this.content = jQuery('.revealer-content')[0];
		this.revealer = jQuery('.revealer-animation')[0];


		var defaults = {
				duration: 500,
				easing: 'easeInOutQuint',
				delay: 0,
				bgcolor: '#f0f0f0',
				direction: 'lr',
				coverArea: 0
			},
			revealSettings = revealSettings || this.options.revealSettings,
			direction = revealSettings.direction || defaults.direction,
			transformSettings = this._getTransformSettings(direction);

		this.revealer.style.WebkitTransform = this.revealer.style.transform =  transformSettings.val;
		this.revealer.style.WebkitTransformOrigin = this.revealer.style.transformOrigin =  transformSettings.origin.initial;
		this.revealer.style.backgroundColor = revealSettings.bgcolor || defaults.bgcolor;
		this.revealer.style.opacity = 1;


		var self = this,
			animationSettings_2 = {
				complete: function() {
					self.isAnimating = false;
					if( typeof revealSettings.onComplete === 'function' ) {
						revealSettings.onComplete(self.content, self.revealer);
					}
				}
			},

			animationSettings = {
				delay: revealSettings.delay || defaults.delay,
				complete: function() {
					self.revealer.style.WebkitTransformOrigin = self.revealer.style.transformOrigin = transformSettings.origin.halfway;		
					if( typeof revealSettings.onCover === 'function' ) {
						revealSettings.onCover(self.content, self.revealer);
					}
					anime(animationSettings_2);		
				}
			};

		animationSettings.targets = animationSettings_2.targets = this.revealer;
		animationSettings.duration = animationSettings_2.duration = revealSettings.duration || defaults.duration;
		animationSettings.easing = animationSettings_2.easing = revealSettings.easing || defaults.easing;

		var coverArea = revealSettings.coverArea || defaults.coverArea;
		if( direction === 'lr' || direction === 'rl' ) {
			animationSettings.scaleX = [0,1];
			animationSettings_2.scaleX = [1,coverArea/100];
		}
		else {
			animationSettings.scaleY = [0,1];
			animationSettings_2.scaleY = [1,coverArea/100];
		}

		if( typeof revealSettings.onStart === 'function' ) {
			revealSettings.onStart(self.content, self.revealer);
		}
		anime(animationSettings);
	};
	
	window.RevealFx = RevealFx;

})(window);

(function() {
	var navEl = jQuery('nav.menu'),
		revealer = new RevealFx(navEl[0]),
		closeCtrl = navEl.find('.btn-close')[0];

	document.querySelector('.btn-menu').addEventListener('click', function() {

		jQuery('.menu').addClass('menu-open');

		revealer.reveal({
			bgcolor: '#ff524e',
			duration: 400, 
			easing: 'easeInOutCubic',
			onCover: function(contentEl, revealerEl) {
				contentEl.style.opacity = 1;
			},
			onComplete: function() {
				closeCtrl.addEventListener('click', closeMenu);
				jQuery('.revealer-content').addClass('active');
			}
		});
	});

	function closeMenu() {
		closeCtrl.removeEventListener('click', closeMenu);
		revealer.reveal({
			bgcolor: '#ff524e',
			duration: 400, 
			easing: 'easeInOutCubic',
			onCover: function(contentEl, revealerEl) {
				contentEl.style.opacity = 0;
				jQuery('.revealer-content').removeClass('active');
			},
			onComplete: function() {
				navEl.removeClass('menu-open');
			}
		});
	}
})();