<?php
/*
Plugin Name: Meow Lightbox
Plugin URI: https://meowapps.com/plugin/meow-lightbox
Description: Lightbox designed by and for photographers.
Version: 5.1.8
Author: Jordy Meow
Author URI: https://meowapps.com
Text Domain: meow-lightbox
Domain Path: /languages
*/

if ( !defined( 'MWL_VERSION' ) ) {
  define( 'MWL_VERSION', '5.1.8' );
  define( 'MWL_PREFIX', 'mwl' );
  define( 'MWL_DOMAIN', ' meow-lightbox' );
  define( 'MWL_ENTRY', __FILE__ );
  define( 'MWL_PATH', dirname( __FILE__ ) );
  define( 'MWL_URL', plugin_dir_url( __FILE__ ) );
}

require_once( 'classes/init.php');

?>
