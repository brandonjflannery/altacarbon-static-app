(function ($) {
	
	"use strict";

	$(function() {
        $("#tabs").tabs();
    });

	$(window).scroll(function() {
	  var scroll = $(window).scrollTop();
	  var box = $('.header-text').height();
	  var header = $('header').height();

	  if (scroll >= box - header) {
	    $("header").addClass("background-header");
	  } else {
	    $("header").removeClass("background-header");
	  }
	});
	

	$('.benefits-filter li').on('click', function() {
        var tsfilter = $(this).data('tsfilter');
        $('.benefits-filter li').removeClass('active');
        $(this).addClass('active');
        if (tsfilter == 'all') {
            $('.benefits-table').removeClass('filtering');
            $('.ts-item').removeClass('show');
        } else {
            $('.benefits-table').addClass('filtering');
        }
        $('.ts-item').each(function() {
            $(this).removeClass('show');
            if ($(this).data('tsmeta') == tsfilter) {
                $(this).addClass('show');
            }
        });
    });


	// Window Resize Mobile Menu Fix
	mobileNav();

	// Window Resize Mobile Video Fix
	mobileVideo();


	// Scroll animation init
	window.sr = new scrollReveal();
	

	// Menu Dropdown Toggle
	if($('.menu-trigger').length){
		$(".menu-trigger").on('click', function() {	
			$(this).toggleClass('active');
			$('.header-area .nav').slideToggle(200);
			//$('.header-area .nav').slideToggle(900);

		});
	}

	// Menu Item Select Fix
	if($('.menu-trigger').length){
		$(".header-area .nav li a").on('click', function() {	
			$('.header-area .nav').slideToggle(200);

		});
	}


	$(document).ready(function () {
	    $(document).on("scroll", onScroll);
	    
	    //smoothscroll
	    $('.scroll-to-section a[href^="#"]').on('click', function (e) {
	        e.preventDefault();
	        $(document).off("scroll");
	        
	        $('a').each(function () {
	            $(this).removeClass('active');
	        })
	        $(this).addClass('active');
	      
	        var hash_str = this.hash,
	        menu = target;
	       	var target = $(this.hash);
	        $('html, body').stop().animate({
	            scrollTop: (target.offset().top) + 1
	        }, 500, 'swing', function () {
	            window.location.hash = hash_str;
	            $(document).on("scroll", onScroll);
	        });
	    });
	});

	function onScroll(event){
	    var scrollPos = $(document).scrollTop();
	    $('.nav a').each(function () {
	        var currLink = $(this);
	        var refElement = $(currLink.attr("href"));
	        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
	            $('.nav ul li a').removeClass("active");
	            currLink.addClass("active");
	        }
	        else{
	            currLink.removeClass("active");
	        }
	    });
	}


	// Page loading animation
	 $(window).on('load', function() {

        $('#js-preloader').addClass('loaded');

    });


	// Window Resize Mobile Fix
	$(window).on('resize', function() {
		mobileNav();
		mobileVideo();
	});


	// Window Resize Mobile Menu Fix
	function mobileNav() {
		var width = $(window).width();
		$('.submenu').on('click', function() {
			if(width < 767) {
				$('.submenu ul').removeClass('active');
				$(this).find('ul').toggleClass('active');
			}
		});
	}

	// Window Resize Mobile Video Fix
	function mobileVideo() {
		var width = $(window).width();
		if(width < 767) {
			$( "video" ).remove();
		}
	}

	// Show contact form on menu button click
	var banner_form_active = false;
	document.getElementById('contact-menu-btn').addEventListener("click", toggleContactForm);


	// Window Resize Mobile Video Fix
	function toggleContactForm() {
		if (!banner_form_active) {
			showContactForm();
			banner_form_active = true;
		}
		else if (banner_form_active) {
			hideContactForm();
			banner_form_active = false;
		}
	};

	function showContactForm() {
        document.getElementById('altacarbon-banner-form').style.display = 'block';
        document.getElementById('altacarbon-h3').style.display = 'none';
        document.getElementById('altacarbon-h6').style.display = 'none';
    };

    function hideContactForm() {
        document.getElementById('altacarbon-banner-form').style.display = 'none';
        document.getElementById('altacarbon-h3').style.display = 'block';
        document.getElementById('altacarbon-h6').style.display = 'block';
  
    };

	


	

   


})(window.jQuery);