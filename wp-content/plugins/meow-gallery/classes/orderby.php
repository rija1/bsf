<?php

class Meow_MGL_OrderBy {

	public $admin = null;

	static function run( $images, $orderby = null, $order = 'asc' ) {
		$sqlOrderBy = '';
		$order = strtolower( $order );

		// Check params
		if ( $orderby === 'ids' ) {
			$images = $order === 'asc' ? sort( $images ) : rsort( $images );
		}
		else if ( $orderby === 'title' ) {
			$sqlOrderBy = $order === 'asc' ? ' ORDER BY p.post_title ASC' : ' ORDER BY p.post_title DESC';
		}
		else if ( $orderby === 'date' ) {
			$sqlOrderBy = $order === 'asc' ? ' ORDER BY p.post_date ASC' : '  ORDER BY p.post_date DESC';
		}

		// Apply sort
		if ( !empty( $sqlOrderBy ) ) {
			global $wpdb;
			$wpIdsPlaceHolders = array_fill( 0, count( $images ), '%d' );
			$wpIdsPlaceHolders = implode( ', ', $wpIdsPlaceHolders );
			$query = $wpdb->prepare( "SELECT p.ID
				FROM $wpdb->posts p
				WHERE p.ID IN ($wpIdsPlaceHolders)" . $sqlOrderBy, $images );
			$images = $wpdb->get_col( $query );
			
		}
		return $images;
	}

}

?>
