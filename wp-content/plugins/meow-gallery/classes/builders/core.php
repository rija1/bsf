<?php

abstract class Meow_MGL_Builders_Core {

	public $id = null;
	public $layout = 'none';
	public $class_id = 'mgl-gallery-none';
	public $img_class = '';
	public $size = 'large';
	public $customClass = '';
	public $align = null;
	public $ids = array();
	public $link = null;
	public $atts = array();
	public $data = array();
	public $isPreview = false;
	public $updir = null;
	public $captions = false;
	public $animation = null;
	public $infinite = false;

	abstract function inline_css();

	// MEMO: Done migration to the React version.
	public function __construct( $atts, $infinite, $isPreview = false ) {
		$wpUploadDir = wp_upload_dir();
		$options = get_option( Meow_MGL_Core::get_plugin_option_name(), null );
		$this->id = uniqid();
		$this->size = isset( $atts['size'] ) ? $atts['size'] : $this->size;
		$this->size =  apply_filters( 'mgl_media_size', $this->size );
		$this->infinite = $infinite;
		$this->atts = $atts;
		$this->customClass = isset( $atts['custom-class'] ) ? $atts['custom-class'] : null;
		$this->link = isset( $atts['link'] ) ? $atts['link'] : null;
		$this->align = isset( $atts['align'] ) ? $atts['align'] : $this->align;
		$this->isPreview = $isPreview;
		$this->class_id = 'mgl-gallery-' . $this->id;
		$this->updir = trailingslashit( $wpUploadDir['baseurl'] );
		$this->captions = isset( $atts['captions'] ) ? $atts['captions'] : ( $options['captions'] ?? 'none' );
		$this->animation = null;
		if ( isset( $atts['animation'] ) && $atts['animation'] != 'default' )
			$this->animation = $atts['animation'];
		else
			$this->animation = $options['animation'] ?? null;
	}

	function build_inline_attributes( $id, $data ) {
		return '';
	}


	// MEMO: Done migration to the React version.
	function prepare_data( $idsStr ) {
		global $wpdb;

		// Escape the array of IDs for SQL
		$ids = array_map( 'intval', explode(',', $idsStr ) );
		$idsStr = implode( ',', $ids );

		$query = "SELECT p.ID id, p.post_excerpt caption, m.meta_value meta
		FROM $wpdb->posts p, $wpdb->postmeta m
		WHERE m.meta_key = '_wp_attachment_metadata'
		AND p.ID = m.post_id
		AND p.ID IN (" . $idsStr .  ")";
		$res = $wpdb->get_results( $query );
		$this->ids = explode( ',', $idsStr );
		foreach ( $res as $r ) {
			$this->data[$r->id] = array( 'caption' => $r->caption,'meta' => unserialize( $r->meta ) );
		}
		$this->ids = array_reverse( $this->ids );
		$cleanIds = array();
		foreach ( $this->ids as $id ) {
			if ( isset( $this->data[$id] ) )
				array_push( $cleanIds, $id );
		}
		$this->ids = apply_filters( 'mgl_sort', $cleanIds, $this->data, $this->layout, $this->atts );
	}

	function build_next_cell( $id, $data ) {
		$src = $this->updir . $data['meta']['file'];
		$data['caption'] = apply_filters( 'mgl_caption', $data['caption'], $id );
		$caption = $this->captions ? $data['caption'] : '';

		$image_size = Meow_MGL_Core::get_plugin_option( 'image_size', 'srcset' );
		$imgSrc = null;
		if ( empty( $image_size ) || $image_size === 'srcset' ) {
			$imgSrc = wp_get_attachment_image( $id, $this->size, false,
				$this->layout === 'carousel' ? 
					[ 'class' => 'skip-lazy' ] :
					[ 'class' => 'wp-image-' . $id ]
			);
		}
		else {
			$info = wp_get_attachment_image_src( $id, $image_size );
			$imgSrc = '<img loading="lazy" src="' . $info[0] . '" class="' .
				( $this->layout === 'carousel' ? 'skip-lazy' : ( 'wp-image-' . $id ) ) . '" />';
		}
		$attributes = $this->build_inline_attributes( $id, $data );
		$attributes = apply_filters( 'mgl_attributes', $attributes, $id, $data );
		if ( !empty( $attributes ) ) {
			$attributes = ' ' . $attributes;
		}

		$linkUrl = null;
		if ( $this->link === 'attachment' )
			$linkUrl = get_permalink( (int)$id );
		else if ( $this->link === 'media' || $this->link === 'file' )
			$linkUrl = $src;
		$linkUrl = apply_filters( 'mgl_link', $linkUrl, (int)$id, $data );
		$isPreview = $this->isPreview;
		ob_start();
		include dirname( __FILE__ ) . '/cell.tpl.php';
		$html = ob_get_clean();
		return $html;
	}

	// MEMO: Done migration to the React version.
	function build_container_classes() {
		$classes = 'mgl-' . $this->layout . '-container';
		
		// Align
		$classes .= $this->align ? (' align' . $this->align) : '';

		return $classes;
	}

	// MEMO: Done migration to the React version.
	function build_classes() {
		$classes = 'mgl-gallery';

		// Layout
		$classes .= ' mgl-' . $this->layout;

		// Custom Class
		$classes .= $this->customClass ? ( ' ' . $this->customClass ) : '';

		// Animation
		if ( $this->animation )
			$classes .= ' is-animated ' . $this->animation;

		// Captions
		if ( $this->captions )
			$classes .= ' captions-' . $this->captions;

		return $classes;
	}

	// MEMO: Done migration to the React version.
	function build_styles() {
		return "";
	}

	function build( $idsStr ) {

		// Generate gallery
		$classes = $this->build_classes();
		$styles = $this->build_styles();
		$out = "<div id='{$this->class_id}' class='{$classes}' style='{$styles}'>";
		$this->prepare_data( $idsStr );
		while ( count( $this->ids ) > 0 ) {
			$id = array_pop( $this->ids );
			$out .= $this->build_next_cell( $id, $this->data[$id] );
		}
		$out .= '</div>';
		$out = apply_filters( 'mgl_gallery_written', $out, $this->layout );

		// MEMO: Done migration to the React version.
		// Generate gallery container
		$container_classes = $this->build_container_classes();
		$inline_css = $this->inline_css();
		if ( !empty( $inline_css ) ) {
			$inline_css = preg_replace( "/\r|\n/", "", $inline_css );
			$container = "<div class='{$container_classes}'>{$inline_css}{$out}</div>";
		}
		else {
			$container = "<div class='{$container_classes}'>{$out}</div>";
		}

		return $container;
	}

}

?>
