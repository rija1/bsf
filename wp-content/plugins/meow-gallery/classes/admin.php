<?php

class Meow_MGL_Admin extends MeowCommon_Admin {

	private $core;
	
	public function __construct($core) {
		parent::__construct( MGL_PREFIX, MGL_ENTRY, MGL_DOMAIN, class_exists( 'MeowPro_MGL_Core' ) );
		$this->core = $core;
		add_action( 'admin_menu', array( $this, 'app_menu' ) );
		$blocks_enabled = function_exists( 'register_block_type' );
		if ( $blocks_enabled ) {
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		}
		$options = $this->core->get_all_options();
		if ( ( $options['captions'] ?? 'notset' ) === 'notset' ) {
			// MEOMO: mgl_captions_enabled option is used only here. Also, it deletes soon after being used.
			//        So we keep this option what it is (not migrated to the mgl_options).
			$captions_enabled = get_option( 'mgl_captions_enabled' );
			$this->core->update_options( array_merge(
				$options,
				[ 'captions' => $captions_enabled ? 'hover-only' : false ]
			) );
			delete_option( 'mgl_captions_enabled' );
		}
	}

	public function mgl_settings() {
		echo '<div id="mgl-admin-settings"></div>';
	}

	function enqueue_scripts() {

		// Javascript for gallery
		$physical_file = MGL_PATH . '/app/galleries.js';
		$cache_buster = file_exists( $physical_file ) ? filemtime( $physical_file ) : MGL_VERSION;
		wp_register_script( 'mgl-gallery-js', plugins_url( '/app/galleries.js', __DIR__ ), 
			array(), $cache_buster, false );

		// Load the "admin" scripts
		$physical_file = MGL_PATH . '/app/admin.js';
		$cache_buster = file_exists( $physical_file ) ? filemtime( $physical_file ) : MGL_VERSION;
		wp_register_script( 'mgl-admin-js', MGL_URL . '/app/admin.js', 
			array( 'mgl-gallery-js', 'wp-editor', 'wp-i18n', 'wp-element' ), $cache_buster );
		register_block_type( 'meow-gallery/gallery', array( 'editor_script' => 'mgl-admin-js' ));

		// Load the fonts
		wp_register_style( 'meow-neko-ui-lato-font', '//fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap');
		wp_enqueue_style( 'meow-neko-ui-lato-font' );

		// Localize and options
		global $wplr;
		wp_localize_script( 'mgl-admin-js', 'mgl_meow_gallery', [
			//'api_nonce' => wp_create_nonce( 'mfrh_media_file_renamer' ),
			'api_url' => get_rest_url( null, '/meow-gallery/v1/' ),
			'rest_url' => get_rest_url(),
			'plugin_url' => MGL_URL,
			'prefix' => MGL_PREFIX,
			'domain' => MGL_DOMAIN,
			'is_pro' => class_exists( 'MeowPro_MGL_Core' ),
			'is_registered' => !!$this->is_registered(),
			'rest_nonce' => wp_create_nonce( 'wp_rest' ),
			'wplr_collections' => $wplr ? $wplr->read_collections_recursively() : [],
			'options' => $this->core->get_all_options(),
		] );

		wp_enqueue_script( 'mgl-admin-js' );
	}

	function app_menu() {
		add_submenu_page( 'meowapps-main-menu', __( 'Gallery', MGL_DOMAIN ), __( 'Gallery', MGL_DOMAIN ), 
			'manage_options', 'mgl_settings', array( $this, 'mgl_settings' )
		);
	}
}

?>
