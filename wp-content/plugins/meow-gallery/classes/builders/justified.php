<?php

class Meow_MGL_Builders_Justified extends Meow_MGL_Builders_Core {

	public function __construct( $atts, $infinite, $isPreview = false ) {
		parent::__construct( $atts, $infinite, $isPreview );
		$this->layout = 'justified';
	}

	function inline_css() {
		$class_id = '#' . $this->class_id;
		$gutter = isset( $this->atts['gutter'] ) ?
			$this->atts['gutter'] : Meow_MGL_Core::get_plugin_option( 'justified_gutter', 10 );
		$isPreview = $this->isPreview;
		ob_start();
		include dirname( __FILE__ ) . '/justified.css.php';
		$html = ob_get_clean();
		return $html;
	}

	function build_next_cell( $id, $data ) {
		$html = parent::build_next_cell( $id, $data );
		$style_vars = '--w: ' . $data['meta']['width'] . '; --h: ' . $data['meta']['height'];
		$html = str_replace( 'class="mgl-item"', 'class="mgl-item" style="' . $style_vars . '"', $html );
		return $html;
	}

	function build_styles() {
		$row_height = isset( $this->atts['row-height'] ) ?
			$this->atts['row-height'] : Meow_MGL_Core::get_plugin_option( 'justified_row_height', 200 );
		$styles = '--rh: ' . $row_height . 'px';
		return $styles;
	}

}

?>
