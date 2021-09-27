SELECT rooms.type_id, COUNT(rooms.id) 
FROM rooms_type, rooms 
WHERE rooms_type.id = rooms.type_id AND rooms.id IN (
    SELECT id FROM rooms 
    WHERE id NOT IN (
        SELECT rooms_id 
        FROM rooms_booked AS rb 
        WHERE bookings_id IN (
            SELECT id 
            FROM bookings AS b 
            WHERE (b.check_in_date <= " + "'" +profile.startdate + "'" + " AND b.check_out_date > "+ "'" + profile.finishdate +"'" + ") 
            OR (b.check_in_date < " + "'" + profile.finishdate +"'" + "AND b.check_out_date >= " + "'" + profile.finishdate + "'" +") 
            OR (" + "'" + profile.startdate +"'" + "<= b.check_in_date AND " + "'" + profile.finishdate + "'" + "> b.check_in_date)))) 
GROUP BY rooms.type_id