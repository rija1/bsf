<style>

	.mgl-masonry {
		display: <?php echo ($isPreview ? 'block' : 'none') ?>;
	}

	<?php echo esc_attr( $class_id ) ?> {
		column-count: <?php echo (int)$columns ?>;
		margin: <?php echo -1 * ( (int)$gutter / 2 ) ?>px;
	}

	<?php echo esc_attr( $class_id ) ?> .mgl-item {
		padding: <?php echo (int)$gutter / 2 ?>px;
	}

	<?php echo esc_attr( $class_id ) ?> figcaption {
		padding: <?php echo (int)$gutter / 2 ?>px;
	}

	@media screen and (max-width: 800px) {
		<?php echo esc_attr( $class_id ) ?> {
			column-count: 2;
		}
	}

	@media screen and (max-width: 600px) {
		<?php echo esc_attr( $class_id ) ?> {
			column-count: 1;
		}
	}

</style>
