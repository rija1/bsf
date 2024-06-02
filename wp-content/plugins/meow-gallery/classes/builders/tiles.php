<?php

class Meow_MGL_Builders_Tiles extends Meow_MGL_Builders_Core {

	public function __construct( $atts, $infinite, $isPreview = false ) {
		parent::__construct( $atts, $infinite, $isPreview );
		$this->layout = 'tiles';
	}

	function inline_css() {
		$class_id = '#' . $this->class_id;
		
		$isPreview = $this->isPreview;
		
		$options = get_option( Meow_MGL_Core::get_plugin_option_name(), null );

		$gutter = [];
		if ( isset( $this->atts['gutter'] ) ) {
			$gutter['desktop'] = $this->atts['gutter'];
			$gutter['tablet'] = $this->atts['gutter'];
			$gutter['mobile'] = $this->atts['gutter'];
		}
		else {
			$gutter['desktop'] = $options['tiles_gutter'] ?? 10;
			$gutter['tablet'] = $options['tiles_gutter_tablet'] ?? 10;
			$gutter['mobile'] = $options['tiles_gutter_mobile'] ?? 10;
		}

		$density = [];
		if ( isset( $this->atts['density'] ) ) {
			$density['desktop'] = $this->atts['density'];
			$density['tablet'] = $this->atts['density'];
			$density['mobile'] = $this->atts['density'];
		}
		else {
			$density['desktop'] = $options['tiles_density'] ?? 'high';
			$density['tablet'] = $options['tiles_density_tablet'] ?? 'medium';
			$density['mobile'] = $options['tiles_density_mobile'] ?? 'low';
		}

		ob_start();
		include dirname( __FILE__ ) . '/tiles.css.php';
		$html = ob_get_clean();
		return $html;
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
