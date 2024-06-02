<?php

if ( class_exists( 'MeowPro_MGL_Core' ) && class_exists( 'Meow_MGL_Core' ) ) {
	function mgl_admin_notices() {
		echo '<div class="error"><p>Thanks for installing the Pro version of Meow Gallery :) However, the free version is still enabled. Please disable or uninstall it.</p></div>';
	}
	add_action( 'admin_notices', 'mgl_admin_notices' );
	return;
}

spl_autoload_register(function ( $class ) {
  $necessary = true;
  $file = null;
  if ( strpos( $class, 'Meow_MGL_Builders_' ) !== false ) {
    $necessary = false;
    $file = MGL_PATH . '/classes/builders/' . str_replace( 'meow_mgl_builders_', '', strtolower( $class ) ) . '.php';
    if ( !file_exists( $file ) ) {
      $file = MGL_PATH . '/premium/builders/' . str_replace( 'meow_mgl_builders_', '', strtolower( $class ) ) . '.php';
    }
  }
  else if ( strpos( $class, 'Meow_MGL' ) !== false ) {
    $file = MGL_PATH . '/classes/' . str_replace( 'meow_mgl_', '', strtolower( $class ) ) . '.php';
  }
  else if ( strpos( $class, 'MeowCommon_' ) !== false ) {
    $file = MGL_PATH . '/common/' . str_replace( 'meowcommon_', '', strtolower( $class ) ) . '.php';
  }
  else if ( strpos( $class, 'MeowCommonPro_' ) !== false ) {
    $necessary = false;
    $file = MGL_PATH . '/common/premium/' . str_replace( 'meowcommonpro_', '', strtolower( $class ) ) . '.php';
  }
  else if ( strpos( $class, 'MeowPro_MGL' ) !== false ) {
    $necessary = false;
    $file = MGL_PATH . '/premium/' . str_replace( 'meowpro_mgl_', '', strtolower( $class ) ) . '.php';
  }
  if ( $file ) {
    if ( !$necessary && !file_exists( $file ) ) {
      return;
    }
    require( $file );
  }
});

new Meow_MGL_Core();

?>