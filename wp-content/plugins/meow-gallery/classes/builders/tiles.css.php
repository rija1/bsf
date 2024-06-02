<style>

	.mgl-tiles {
		display: <?php echo ($isPreview ? 'block' : 'none') ?>;
	}

	<?php echo esc_attr( $class_id ) ?> {
		margin: <?php echo -1 * ( (int)$gutter['desktop'] / 2 ) ?>px;
		width: calc(100% + <?php echo (int)$gutter['desktop'] ?>px);
	}

	<?php echo esc_attr( $class_id ) ?> .mgl-box {
		padding: <?php echo (int)$gutter['desktop'] / 2 ?>px;
	}

	@media screen and (max-width: 768px) {
		<?php echo esc_attr( $class_id ) ?> {
			margin: <?php echo -1 * ( (int)$gutter['tablet'] / 2 ) ?>px;
			width: calc(100% + <?php echo (int)$gutter['tablet'] ?>px);
		}

		<?php echo esc_attr( $class_id ) ?> .mgl-box {
			padding: <?php echo (int)$gutter['tablet'] / 2 ?>px;
		}	
	}

	@media screen and (max-width: 460px) {
		<?php echo esc_attr( $class_id ) ?> {
			margin: <?php echo -1 * ( (int)$gutter['mobile'] / 2 ) ?>px;
			width: calc(100% + <?php echo (int)$gutter['mobile'] ?>px);
		}

		<?php echo esc_attr( $class_id ) ?> .mgl-box {
			padding: <?php echo (int)$gutter['mobile'] / 2 ?>px;
		}	
	}

</style>
