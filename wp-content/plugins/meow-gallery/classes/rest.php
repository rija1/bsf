<?php

class Meow_MGL_Rest
{
	private $core;
	private $namespace = 'meow-gallery/v1';

	public function __construct( $core ) {
    $this->core = $core;

		// FOR DEBUG
		// For experiencing the UI behavior on a slower install.
		// sleep(1);
		// For experiencing the UI behavior on a buggy install.
		// trigger_error( "Error", E_USER_ERROR);
		// trigger_error( "Warning", E_USER_WARNING);
		// trigger_error( "Notice", E_USER_NOTICE);
		// trigger_error( "Deprecated", E_USER_DEPRECATED);

		add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
	}


	function rest_api_init() {

		// Settings
		register_rest_route( $this->namespace, '/update_option/', array(
			'methods' => 'POST',
			'permission_callback' => array( $this->core, 'can_access_settings' ),
			'callback' => array( $this, 'rest_update_option' )
		) );
		register_rest_route( $this->namespace, '/all_settings/', array(
			'methods' => 'GET',
			'permission_callback' => array( $this->core, 'can_access_settings' ),
			'callback' => array( $this, 'rest_all_settings' )
		) );
		register_rest_route( $this->namespace, '/reset_options', array(
			'methods' => 'POST',
			'permission_callback' => array( $this->core, 'can_access_settings' ),
			'callback' => array( $this, 'rest_reset_options' )
		) );


		// Gallery Manager
		register_rest_route( $this->namespace, '/latest_photos', array(
			'methods' => 'GET',
			'permission_callback' => array( $this->core, 'can_access_features' ),
			'callback' => array( $this, 'rest_latest_photos' ),
			'args' => array(
				'search' => array( 'required' => false ),
				'offset' => array( 'required' => false, 'default' => 0 ),
				'except' => array( 'required' => false ),
			)
		) );
		register_rest_route( $this->namespace, '/save_shortcode', array(
			'methods' => 'POST',
			'permission_callback' => array( $this->core, 'can_access_features' ),
			'callback' => array( $this, 'rest_save_shortcode' ),
		) );
		register_rest_route( $this->namespace, '/fetch_shortcodes', array(
			'methods' => 'POST',
			'permission_callback' => array( $this->core, 'can_access_features' ),
			'callback' => array( $this, 'rest_fetch_shortcodes' ),
		) );
		register_rest_route( $this->namespace, '/remove_shortcode', array(
			'methods' => 'POST',
			'permission_callback' => array( $this->core, 'can_access_features' ),
			'callback' => array( $this, 'rest_remove_shortcode' ),
		) );

		//Collection Manager
		register_rest_route( $this->namespace, '/fetch_collections', array(
			'methods' => 'POST',
			'permission_callback' => array( $this->core, 'can_access_features' ),
			'callback' => array( $this, 'rest_fetch_collections' ),
		) );
		register_rest_route( $this->namespace, '/save_collection', array(
			'methods' => 'POST',
			'permission_callback' => array( $this->core, 'can_access_features' ),
			'callback' => array( $this, 'rest_save_collection' ),
		) );
		register_rest_route( $this->namespace, '/remove_collection', array(
			'methods' => 'POST',
			'permission_callback' => array( $this->core, 'can_access_features' ),
			'callback' => array( $this, 'rest_remove_collection' ),
		) );
		register_rest_route( $this->namespace, '/load_gallery_collection', array(
			'methods' => 'POST',
			'permission_callback' => '__return_true',
			'callback' => array( $this, 'rest_load_gallery_collection' ),
		) );

		// Gutenberg Block
		register_rest_route( $this->namespace, '/preview', array(
			'methods' => 'POST',
			'permission_callback' => array( $this->core, 'can_access_features' ),
			'callback' => array( $this, 'preview' ),
		) );

		// Gallery
		register_rest_route( $this->namespace, '/images/', array(
			'methods' => 'GET',
			'permission_callback' => '__return_true',
			'callback' => array( $this, 'rest_images' ),
			'args' => array(
				'imageIds' => array( 'required' => true ),
				'atts' => array( 'required' => true ),
				'layout' => array( 'required' => true ),
				'size' => array( 'required' => true ),
			)
		) );
	}

	function preview( WP_REST_Request $request ) {
		$params = $request->get_body();
		$params = json_decode( $params );
		$params->ids = implode( ',', $params->ids );
		$atts = (array) $params;
		$html = $this->core->gallery( $atts, true );
		return new WP_REST_Response( [ 'success' => true, 'data' => $html ], 200 );
	}

	function rest_load_gallery_collection( $request ) {
		try {
			$params = $request->get_json_params();
			$gallery_id = $params['id'];
			$search_slug = $params['search_slug'];

			$key = [
				'gallery_id' => 'id',
				'wplr_collection_id' => 'wplr-collection',
			];

			$html = $this->core->gallery( [ $key[$search_slug] => $gallery_id ], false );
			$mwlData = json_encode( $this->core->get_rewritten_mwl_data() );
			return new WP_REST_Response( [ 'success' => true, 'data' => $html, 'mwl_data' => $mwlData ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	function rest_all_settings() {
		return new WP_REST_Response( [ 'success' => true, 'data' => $this->core->get_all_options() ], 200 );
	}

	function rest_reset_options() {
		$this->core->reset_options();
		return new WP_REST_Response( [ 'success' => true, 'options' => $this->core->get_all_options() ], 200 );
	}

	function rest_save_shortcode( $request ) {
		try {
			$params = $request->get_json_params();

			$id = $params['id'];
			$medias = $params['medias'];
			$name = $params['name'];
			$layout = $params['layout'];
			$description = $params['description'];
			$posts = $params['posts'];
			$latest_posts = $params['latest_posts'];
			$is_post_mode = $params['is_post_mode'];


			if ( !$name ) {
				throw new Exception( __( 'Please enter a name for your shortcode.', MGL_DOMAIN ) );
			}

			if ( !$is_post_mode && ( !$medias || !count( $medias['thumbnail_ids'] ) ) ) {
				throw new Exception( __( 'Please select at least one image.', MGL_DOMAIN ) );
			}

			if ( $is_post_mode && ( !$posts && !$latest_posts ) ) {
				throw new Exception( __( 'Please select at least one post.', MGL_DOMAIN ) );
			}

			if ( !$id || $id == '' ) {
				$id = $this->core->generate_uniqid(10);
			}

			$shortcodes = get_option( 'mgl_shortcodes', array() );

			$shortcodes[$id] = [
				'name' => $name,
				'description' => $description,
				'layout' => $layout,
				'medias' => $medias,
				'is_post_mode' => $is_post_mode,
				'posts' => $posts,
				'latest_posts' => $latest_posts,
				'updated' =>  time(),
			];

			update_option( 'mgl_shortcodes', $shortcodes );

			return new WP_REST_Response([ 'success' => true, 'message' => 'Shortcode created.' ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	function rest_remove_collection( $request ) {
		try {
			$params = $request->get_json_params();
			$id = $params['id'];
			$collections = get_option( 'mgl_collections', array() );
			unset( $collections[$id] );
			update_option( 'mgl_collections', $collections );
			return new WP_REST_Response([ 'success' => true, 'message' => 'Collection removed.' ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	function rest_save_collection( $request ) {
		try {
			$params = $request->get_json_params();

			$id = $params['id'];
			$name = $params['name'];
			$layout = $params['layout'];
			$galleries_ids = $params['galleries_ids'];
			$description = $params['description'];
			
			if ( !$name ) {
				throw new Exception( __( 'Please enter a name for your collection.', MGL_DOMAIN ) );
			}

			if ( !$galleries_ids || !count( $galleries_ids ) ) {
				throw new Exception( __( 'Please select at least one gallery.', MGL_DOMAIN ) );
			}

			if ( !$id || $id == '' ) {
				$id = $this->core->generate_uniqid(10);
			}

			$collections = get_option( 'mgl_collections', array() );

			$collections[$id] = [
				'name' => $name,
				'description' => $description,
				'layout' => $layout,
				'galleries_ids' => $galleries_ids,
				'updated' =>  time(),
			];

			update_option( 'mgl_collections', $collections );

			return new WP_REST_Response([ 'success' => true, 'message' => 'Collection created.' ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}


	function rest_fetch_collections( $request ) {
		try {
			$params = $request->get_json_params();

			$offset = isset( $params['offset'] ) ? $params['offset'] : 0;
			$limit = isset( $params['limit'] ) ? $params['limit'] : 10;
			$sort_updated = $params['sort']['by']; // desc, asc

			$collections = get_option( 'mgl_collections', array() );
			$total = count( $collections );

			$collections = array_slice( $collections, $offset, $limit );
			// Sort by updated
			if ( $sort_updated == 'desc' ) {
				uasort( $collections, function( $a, $b ) {
					return $b['updated'] - $a['updated'];
				});
			}
			else {
				uasort( $collections, function( $a, $b ) {
					return $a['updated'] - $b['updated'];
				});
			}

			$galleries_data = get_option( 'mgl_shortcodes', array() );
			foreach ( $collections as $key => $collection ) {
				$collection['galleries'] = array();
				foreach ( $collection['galleries_ids'] as $gallery_id ) {
					if ( array_key_exists( $gallery_id, $galleries_data ) ) {
						$collection['galleries'][] = $galleries_data[$gallery_id];
					}
				}
				$collections[$key] = $collection;
			}

			return new WP_REST_Response([ 'success' => true, 'data' => $collections, 'total' => $total ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	function rest_fetch_shortcodes( $request ) {
		try {
			$params = $request->get_json_params();

			$offset = isset( $params['offset'] ) ? $params['offset'] : 0;
			$limit = isset( $params['limit'] ) ? $params['limit'] : 10;
			$sort_updated = $params['sort']['by']; // desc, asc

			$shortcodes = get_option( 'mgl_shortcodes', array() );
			$total = count( $shortcodes );

			$shortcodes = array_slice( $shortcodes, $offset, $limit );
			// Sort by updated
			if ( $sort_updated == 'desc' ) {
				uasort( $shortcodes, function( $a, $b ) {
					return $b['updated'] - $a['updated'];
				});
			}
			else {
				uasort( $shortcodes, function( $a, $b ) {
					return $a['updated'] - $b['updated'];
				});
			}

			return new WP_REST_Response([ 'success' => true, 'data' => $shortcodes, 'total' => $total ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	function rest_remove_shortcode( $request ) {
		try {
			$params = $request->get_json_params();
			$id = $params['id'];
			$shortcodes = get_option( 'mgl_shortcodes', array() );
			unset( $shortcodes[$id] );
			update_option( 'mgl_shortcodes', $shortcodes );
			return new WP_REST_Response([ 'success' => true, 'message' => 'Shortcode removed.' ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	function rest_latest_photos( $request ) {
		$search = trim( $request->get_param('search') );
		$offset = trim( $request->get_param('offset') );
		$except = json_decode( trim( $request->get_param('except') ), true);
		$unusedImages = trim( $request->get_param('unusedImages') );

		global $wpdb;
		$searchPlaceholder = $search ? '%' . $search . '%' : '';
		$where_search_clause = $search ? $wpdb->prepare(
			"AND (p.post_title LIKE %s OR p.post_content LIKE %s OR p.post_name LIKE %s) ",
			$searchPlaceholder,
			$searchPlaceholder,
			$searchPlaceholder
		) : '';
		$where_search_clause .= $except && count($except) ? $wpdb->prepare(
			"AND p.ID NOT IN (" . implode(', ', array_fill(0, count($except), '%s')) . ")", $except
		) : '';
		$join_clause = '';
		if ( $unusedImages ) {
			// Retrieve the serialized option from the database
			$meow_gallery_shortcodes = get_option( 'mgl_shortcodes' );

			// Deserialize the option to get the array
			$shortcodes_array = maybe_unserialize( $meow_gallery_shortcodes );

			// Extract all thumbnail IDs from the array
			$used_thumbnail_ids = [];
			foreach ( $shortcodes_array as $shortcode ) {
				if ( isset($shortcode['medias']['thumbnail_ids'] ) && is_array( $shortcode['medias']['thumbnail_ids'] ) ) {
					$used_thumbnail_ids = array_merge( $used_thumbnail_ids, $shortcode['medias']['thumbnail_ids'] );
				}
			}

			// Make sure the IDs are integers
			$used_thumbnail_ids = array_map( 'intval', $used_thumbnail_ids );

			// Include the NOT IN clause to exclude used thumbnail IDs
			if ( !empty( $used_thumbnail_ids ) ) {
				$placeholders = implode( ',', array_fill( 0, count( $used_thumbnail_ids ), '%d' ) );
				$where_search_clause .= $wpdb->prepare( " AND p.ID NOT IN ($placeholders) ", $used_thumbnail_ids );
			}
		}
		$posts = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT p.ID, p.post_title, p.post_mime_type 
				FROM $wpdb->posts p 
				$join_clause
				WHERE p.post_type='attachment' 
				AND p.post_status='inherit' 
				$where_search_clause 
				ORDER BY p.post_modified DESC 
				LIMIT %d, 23", $offset
			), OBJECT
		);
		$posts_count = (int)$wpdb->get_var(
			"SELECT COUNT(*)
			FROM $wpdb->posts p 
			$join_clause
			WHERE p.post_type='attachment' 
			AND p.post_status='inherit' 
			$where_search_clause"
		);

		$data = [];
		foreach ( $posts as $post ) {
			$file_url = get_attached_file( $post->ID );

			$mime = $post->post_mime_type;
			$is_video = ( strpos( $mime, 'video' ) !== false );

			$thumbnail_url = $is_video ? wp_get_attachment_url( $post->ID ) : wp_get_attachment_image_url( $post->ID, 'thumbnail' );

			if ( file_exists( $file_url ) ) {
				$data[] = [
					'id' => $post->ID,
					'thumbnail_url' => $thumbnail_url,
					'zoom_url' => wp_get_attachment_image_url($post->ID, 'large'),
					'title' => $post->post_title,
					'filename' => basename( $file_url ),
					'size' => size_format( filesize( $file_url ) ),
					'mime' => $mime,
				];
			}
		}
		return new WP_REST_Response( [
			'success' => true,
			'data' => $data,
			'total' => $posts_count
		], 200 );
	}

	function rest_update_option( $request ) {
		try {
			$params = $request->get_json_params();
			$value = $params['options'];
			$options = $this->core->update_options( $value );
			$success = !!$options;
			$message = __( $success ? 'OK' : "Could not update options.", MGL_DOMAIN );
			return new WP_REST_Response([ 'success' => $success, 'message' => $message, 'options' => $success ? $options : null ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	function rest_images( $request ) {
		$image_ids = trim( $request->get_param('imageIds') );
		$atts = trim( $request->get_param('atts') );
		$layout = trim( $request->get_param('layout') );
		$size = trim( $request->get_param('size') );

		return new WP_REST_Response( [
			'success' => true,
			'data' => $this->core->get_gallery_images( json_decode( $image_ids, true ), json_decode($atts, true), $layout, $size )
		], 200 );
	}

}

?>