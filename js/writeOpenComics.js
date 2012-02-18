var source = 'http://opencomics.dev';

	document.write('<link href="'+source+'/css/openComicsStyles.css" rel="stylesheet" type="text/css">');
	document.write('<link href="'+source+'/css/dark-hive/jquery-ui-1.8.17.custom.css" rel="stylesheet" type="text/css">');
if (typeof jQuery == 'undefined') {  
	document.write('<script type="text/javascript" src="'+source+'/js/jquery-1.7.1.min.js"></script>');
}
	document.write('<script type="text/javascript" src="'+source+'/js/jquery-ui-1.8.17.custom.min.js"></script>');
	document.write('<script type="text/javascript" src="'+source+'/js/openComicsFunctions.js"></script>');
	

	