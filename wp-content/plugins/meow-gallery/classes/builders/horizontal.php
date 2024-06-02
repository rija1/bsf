<?php

class Meow_MGL_Builders_Horizontal extends Meow_MGL_Builders_Core {

	public function __construct( $atts, $infinite, $isPreview = false ) {
		parent::__construct( $atts, false, $isPreview );
		$this->layout = 'horizontal';
	}

	function inline_css() {
		$options = get_option( Meow_MGL_Core::get_plugin_option_name(), null );
		$class_id = '#' . $this->class_id;
		$gutter = isset( $this->atts['gutter'] ) ? $this->atts['gutter'] : ( $options['horizontal_gutter'] ?? 10 );
		$image_height = isset( $this->atts['image_height'] ) ? $this->atts['image_height'] : ( $options['horizontal_image_height'] ?? 500 );
		$hide_scrollbar = isset( $this->atts['hide_scrollbar'] ) ? $this->atts['hide_scrollbar'] : ( $options['horizontal_hide_scrollbar'] ?? false );
		$isPreview = $this->isPreview;
		ob_start();
		include dirname( __FILE__ ) . '/horizontal.css.php';
		$html = ob_get_clean();
		return $html;
	}

	function build( $idsStr ) {

		$options = get_option( Meow_MGL_Core::get_plugin_option_name(), null );

		// Generate gallery
		$classes = $this->build_classes();
		$styles = $this->build_styles();
		$out = "<div id='{$this->class_id}' class='{$classes}' style='{$styles}'>";
		$gutter = isset( $this->atts['mgl_horizontal_gutter'] )
			? $this->atts['mgl_horizontal_gutter']
			: ( $options['horizontal_gutter'] ?? 5 );
		$hide_scrollbar = isset( $this->atts['hide_scrollbar'] )
			? $this->atts['hide_scrollbar']
			: ( $options['horizontal_hide_scrollbar'] ?? false );
		$classes = $hide_scrollbar ? "$classes hide-scrollbar" : $classes;
		$attributes = "data-mgl-gutter=\"${gutter}\"";

		$out = "<div id='{$this->class_id}' class='{$classes}' style='{$styles}' {$attributes}>";
		$out .= '<div class="meow-horizontal-track">';
		$this->prepare_data( $idsStr );
		while ( count( $this->ids ) > 0 ) {
			$id = array_pop( $this->ids );
			$out .= $this->build_next_cell( $id, $this->data[$id] );
		}
		$out .= '</div>';
		$out .= '</div>';
		$out = apply_filters( 'mgl_gallery_written', $out, $this->layout );

		// Generate gallery container
		$container_classes = $this->build_container_classes();
		$inline_css = $this->inline_css();
		$container = "<div class='{$container_classes}'>{$inline_css}{$out}</div>";

		return $container;
	}

}

?>
