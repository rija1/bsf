<style>

	.mgl-square {
		display: <?php echo ($isPreview ? 'block' : 'none') ?>;
	}

	<?php
	$columns_in_percentage = "20%";

	switch($columns) {
		case 5:
			$columns_in_percentage = "20%";
			break;
		case 4:
			$columns_in_percentage = "25%";
			break;
		case 3:
			$columns_in_percentage = "33.33%";
			break;
		case 2:
			$columns_in_percentage = "50%";
			break;
		case 1:
			$columns_in_percentage = "100%";
			break;
	}
	?>

	<?php echo esc_attr( $class_id ) ?> {
		margin: <?php echo -1 * ( (int)$gutter / 2 ) ?>px;
	}

	<?php echo esc_attr( $class_id ) ?> .mgl-item {
		width: <?php echo (int)$columns_in_percentage ?>%;
		padding-bottom: <?php echo (int)$columns_in_percentage ?>%;
	}

	<?php
	if($columns > 2) {
	?>

	@media screen and (max-width: 460px) {
		<?php echo esc_attr( $class_id ) ?> .mgl-item {
			width: 50%;
			padding-bottom: 50%;
		}
	}

	<?php 
	} 
	?>

	<?php
	if($columns > 1) {
	?>

	@media screen and (max-width: 360px) {
		<?php echo esc_attr( $class_id ) ?> .mgl-item {
			width: 100%;
			padding-bottom: 100%;
		}
	}

	<?php 
	} 
	?>

	<?php echo esc_attr( $class_id ) ?>.custom-gallery-class .mgl-item {
		padding-bottom: <?php echo ( str_replace( '%', '', (int)$columns_in_percentage) / 1.5 ) ?>% !important;
	}

	<?php echo esc_attr( $class_id ) ?> .mgl-item .mgl-icon {
		padding: <?php echo (int)$gutter / 2 ?>px;
	}

	<?php echo esc_attr( $class_id ) ?> .mgl-item figcaption {
		padding: <?php echo (int)$gutter / 2 ?>px;
	}

</style>
