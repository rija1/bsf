<?php

class Meow_MGL_Builders_Raw extends Meow_MGL_Builders_Core {

	public function __construct( $atts, $infinite, $isPreview = false ) {
		parent::__construct( $atts, $infinite, $isPreview );
		$this->layout = 'raw';
	}

	function inline_css() {
		return null;
	}

	function build_inline_attributes( $id, $data ) {
		if ( isset( $data['meta'] ) && isset( $data['meta']['width'] ) && isset( $data['meta']['height'] ) ) {
			return ' data-mgl-id="' . $id . '" data-mgl-width="' . $data['meta']['width'] . '" data-mgl-height="' . 
				$data['meta']['height'] . '"';
		}
		return null;
	}

	function build_next_cell( $id, $data ) {
		$html = parent::build_next_cell( $id, $data );
		return $html;
	}

}

?>
