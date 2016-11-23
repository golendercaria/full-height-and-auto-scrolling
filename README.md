fullHeight&autoScroll
=====================

Ce plugin est un plugin deux en un, il permet d'avoir des blocs HTML full page et d'activer un système de scroll automatique 
pour allez de bloc en bloc.

This plugin have two fonctionnalities, it allow to have HTML bloc in full height and automatics scrolling système for go to 
bloc to bloc.

Documentation
=============

Required
--------

jQuery, work with v3.1.1 (embarqued).

How to use
----------

Basic example
-------------

```js
$(".full-height").apply_full_height();
$(".scrolling").apply_autoscroll();
```

Apply only full height
----------------------

```js
//set full height on selector
$(YOUR_SELECTOR).apply_full_height();
```

Active automatic scrolling
--------------------------

```js
//set autoscroll : 
$(YOUR_SELECTOR).apply_autoscroll();
```

Exemple option for automatic scrolling
--------------------------------------

```js
$(".scrolling").apply_autoscroll({
  'menu'	    	 : true,  // (bool) true || false, defaut true
  'menu_id'		    : 'scroll_menu',  // (string) defaut scroll_menu => absolutely required
  'menu_class'		: null, // (string) defaut null => you can add somme classes
  'menu_parent'  	: 'body', // (string) defaut body => selector for parent menu, the menu is prepend on this element
  'quiet_period'	: 500,  // (int) defaut 500 => quiet period for prevent human scroll add jQuery scrolling animation
  'animation_time'	: 1000, // (int) defaut 1000 (1 seconde) => duration of scrolling
  'first_element'	: $(el[0]), // (jQuery selector) defaut is the first element of scrolling selector
  'last_element'	: $(el[ el.length - 1 ]), // (jQuery selector) defaut is the last element of scrolling selector
});
```
