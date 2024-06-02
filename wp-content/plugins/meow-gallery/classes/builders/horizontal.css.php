<style>

	<?php echo esc_attr( $class_id ) ?> {
		min-height: <?php echo $image_height ?>px;
	}

	<?php echo esc_attr( $class_id ) ?> .meow-horizontal-track {
		height: <?php echo $image_height ?>px;
	}

	<?php echo esc_attr( $class_id ) ?> .meow-horizontal-prev-btn, <?php echo esc_attr( $class_id ) ?> .meow-horizontal-next-btn {
		top: <?php echo $image_height/2 ?>px;
	}

	<?php echo esc_attr( $class_id ) ?> .mgl-item {
		padding: 0 <?php echo (int)$gutter - 20 ?>px;
	}

	<?php echo esc_attr( $class_id ) ?> .mgl-item figcaption {
		width: calc(100% - <?php echo (int)$gutter*2 ?>px);
		padding: 0 <?php echo (int)$gutter / 2 ?>px;
		left: <?php echo (int)$gutter / 2 ?>px;
		bottom: <?php echo (int)$gutter / 2 ?>px;
	}

</style>
