<?php

class Meow_MGL_Builders_Tiles_PHP extends Meow_MGL_Builders_Core {

	public $min_columns = 3;
	public $max_columns = 4;
	public $layouts = array();

	public function __construct( $atts, $infinite, $isPreview = false ) {
		parent::__construct( $atts, $infinite, $isPreview );
		$this->layout = 'tiles';
	}

	function prepare_layouts() {
		$this->layouts = [
			'o', 'i',
			'oo', 'ii', 'oi', 'io',
			'ooo', 'oii', 'ooi', 'ioo', 'oio', 'ioi', 'iio', 'iii',
			'iooo', 'oioo', 'ooio', 'oooi', 'iiii', 'oooo',
			'ioooo', 'ooioo', 'ooooi', 'iiooo', 'iooio', 'ooiio', 'ooioi', 'oooii', 'oiioo', 'oiooi', 'iiioo', 'iiooi', 'iooii', 'ooiii'
		];
	}

	function inline_css() {
		$class_id = '#' . $this->class_id;
		$gutter = isset( $this->atts['gutter'] ) ?
			$this->atts['gutter'] : Meow_MGL_Core::get_plugin_option( 'tiles_gutter', 10 );
		$isPreview = $this->isPreview;
		ob_start();
		include dirname( __FILE__ ) . '/tiles.css.php';
		$html = ob_get_clean();
		return $html;
	}

	function permutations( $items, $perms = array() ) {
		$back = array();
		if ( empty( $items ) ) {
			array_push( $back, join( ' ', $perms ) );
			return $back;
		}
		for ( $i = count( $items ) - 1; $i >= 0; --$i ) {
			$new = $items;
			$newp = $perms;
			list( $foo ) = array_splice( $new, $i, 1 );
			array_unshift( $newp, $foo );
			$back = array_merge( $back, permutations( $new, $newp ) );
		}
		return $back;
	}

	function get_layout( $ids ) {
		$ids = array_reverse( $ids );
		$layout = "";
		foreach ( $ids as $id )
			$layout .= $this->data[$id]['meta']['width'] >= $this->data[$id]['meta']['height'] ? 'o' : 'i';
		return $layout;
	}

	function build_next_cell( $id, $data ) {
		$html = parent::build_next_cell( $id, $data );
		$html = str_replace( '100vw', 100 / 3 . 'vw', $html );
		return $html;
	}

	function build( $idsStr ) {

		// Generate gallery
		$classes = $this->build_classes();
		$styles = $this->build_styles();
		$out = "<div id='{$this->class_id}' class='{$classes}' style='{$styles}'>";
		$this->prepare_data( $idsStr );
		$this->prepare_layouts();
		$ooo_v = 0;

		while ( count( $this->ids ) > 0 ) {
			$size = 5;

			// This seems to handle all issues with the solitary photo
			$howManyLeft = count( $this->ids );
			if ( $howManyLeft >= 4 && $howManyLeft <= 6) {
				$size = $howManyLeft - 2;
				$currentIds = array_slice( $this->ids, $size * -1, $size, true );
				$ideal = $this->get_layout( $currentIds );
				if ( in_array( $ideal, $this->layouts ) )
					$size = $howManyLeft - 2;
				else
					$size = $howManyLeft - 3;
			}

			$layout = null;
			$ideal = "N/A";
			while ( !$layout && $size > 0 ) {
				// Look for exact layout $size-cols
				$currentIds = array_slice( $this->ids, $size * -1, $size, true );
				$ideal = $this->get_layout( $currentIds );
				if ( in_array( $ideal, $this->layouts ) ) {
					$layout = $ideal;
					break;
				}
				$size--;
			}

			// Display an error if the layout does not exist
			if ( !$layout ) {
				echo( '<div style="padding: 20px; background: darkred; color: white;">
					MEOW GALLERY ERROR. No layout for '. $ideal . '.</div>'
				);
				$layout = $ideal;
			}

			// Variations in order to avoid the same layout to be repeated
			$variation = '';
			if ( $layout === 'oooo' ) {
				$variation = '-v' . $ooo_v;
				$ooo_v = $ooo_v > 1 ? 0 : $ooo_v + 1;
			}

			// Create row with cells inside it (using the order in currentIds)
			$count = 0;
			$out .= '<div class="mgl-row mgl-layout-' . strlen( $layout ) . '-' . $layout . $variation . '" data-tiles-layout="'. $layout . $variation .'">';
			while ( count( $currentIds ) > 0 ) {
				$out .= '<div class="mgl-box ' . chr( 97 + $count++ ) . '">';
				$id = array_pop( $this->ids );
				$id = array_pop( $currentIds );
				$out .= $this->build_next_cell( $id, $this->data[$id] );
				$out .= '</div>';
			}
			$out .= '</div>';
		}
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
