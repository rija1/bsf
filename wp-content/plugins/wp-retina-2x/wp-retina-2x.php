<?php
/*
Plugin Name: Perfect Images (Optimize, Rebuild, Replace, Thumbnails, Retina)
Plugin URI: https://meowapps.com
Description: Optimize your images effortlessly. Replace, regenerate, resize, improve, transform, and achieve perfect images for your site.
Version: 6.6.1
Author: Jordy Meow
Author URI: https://meowapps.com
Text Domain: wp-retina-2x
Domain Path: /languages
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
*/

if ( !defined( 'WR2X_VERSION' ) ) {
	define( 'WR2X_VERSION', '6.6.1' );
	define( 'WR2X_PREFIX', 'wr2x' );
	define( 'WR2X_DOMAIN', ' wp-retina-2x' );
	define( 'WR2X_ENTRY', __FILE__ );
	define( 'WR2X_PATH', dirname( __FILE__ ) );
	define( 'WR2X_URL', plugin_dir_url( __FILE__ ) );
	define( 'WR2X_BASENAME', plugin_basename( __FILE__ ) );
	define( 'WR2X_ITEM_ID', 264 );
}

require_once( 'classes/init.php');

?>
