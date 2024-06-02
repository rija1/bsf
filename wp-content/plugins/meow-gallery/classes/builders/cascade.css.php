<style>

	.mgl-cascade {
		display: <?php echo ($isPreview ? 'block' : 'none') ?>;
	}

	<?php echo esc_attr( $class_id ) ?> {
		margin: <?php echo -1 * ( (int)$gutter / 2 ) ?>px;
	}

	<?php echo esc_attr( $class_id ) ?> .mgl-box {
		padding: <?php echo (int)$gutter / 2 ?>px;
	}

	@media screen and (max-width: 600px) {
		<?php echo esc_attr( $class_id ) ?>  figcaption {
			display: none
		}
	}

</style>
