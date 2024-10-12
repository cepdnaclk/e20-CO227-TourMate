package com.mapa.restapi.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.mapa.restapi.model.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class PDFGenerationService {

    public ByteArrayInputStream generateSchedulePdf(ScheduleEvent scheduleEvent) throws DocumentException {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();


        // Initialize PdfWriter for iText 5
        PdfWriter.getInstance(document, out);

        // Open the document to write content
        document.open();

        // Create custom fonts for styling
        Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
        Font boldFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
        Font normalFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL);

        // Add centered and bold title
        Paragraph title = new Paragraph("Travel Schedule", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20); // Add space after title
        document.add(title);

        addScheduleDetails(document, scheduleEvent, normalFont, boldFont);

        // Add a heading for Stops
        Paragraph stopsTitle = new Paragraph("Your Stops:", boldFont);
        stopsTitle.setSpacingBefore(10);
        stopsTitle.setSpacingAfter(10);
        document.add(stopsTitle);

        addStopsTable(document, scheduleEvent, normalFont);

        if (!scheduleEvent.getScheduleRestaurants().isEmpty()){
            addRestaurants(document,scheduleEvent,normalFont,boldFont);

        }
        if(!scheduleEvent.getScheduleHotels().isEmpty()){
            addHotels(document,scheduleEvent,normalFont,boldFont);
        }

        addFooter(document);

        // Close the document
        document.close();


        // Return the generated PDF as a ByteArrayInputStream
        return new ByteArrayInputStream(out.toByteArray());
    }

    private void addHotels(Document document, ScheduleEvent scheduleEvent, Font normalFont, Font boldFont) throws DocumentException {
        // Create a paragraph for the hotels section
        Paragraph hotelHeader = new Paragraph("Your Hotels\n", boldFont);
        document.add(hotelHeader);

        // Loop through the hotels in the schedule event
        for (ScheduleHotel scheduleHotel : scheduleEvent.getScheduleHotels()) {
            // Extract hotel information
            Hotel hotel = scheduleHotel.getHotel();
            String date = scheduleHotel.getDate().toString(); // Assuming date is stored in ScheduleHotel

            // Create a table with 2 columns
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100); // Set table width to 100%

            // Create a cell for the text information
            StringBuilder hotelText = new StringBuilder();
            hotelText.append("Date: ").append(date).append("\n");
            hotelText.append("Hotel: ").append(hotel.getName()).append("\n");
            hotelText.append("Location: ").append(hotel.getLocation()).append("\n");
            hotelText.append("Rating: ").append(hotel.getRating()).append("\n");

            PdfPCell textCell = new PdfPCell();
            textCell.addElement(new Paragraph(hotelText.toString(), normalFont));
            textCell.setBorder(PdfPCell.NO_BORDER); // Remove border from text cell

            // Create a cell for the image
            PdfPCell imageCell = new PdfPCell();
            if (hotel.getImage() != null && !hotel.getImage().isEmpty()) {
                try {
                    Image img = Image.getInstance(hotel.getImage());
                    img.scaleToFit(140, 80); // Scale the image if necessary
                    img.setAlignment(Element.ALIGN_MIDDLE); // Align image to the right
                    imageCell.addElement(img);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            imageCell.setBorder(PdfPCell.NO_BORDER); // Remove border from image cell

            // Add cells to the table
            table.addCell(textCell);
            table.addCell(imageCell);

            // Add the table to the document
            document.add(table);
            document.add(new Paragraph("\n")); // Add a blank line between hotels
        }
    }

    private void addRestaurants(Document document, ScheduleEvent scheduleEvent, Font normalFont, Font boldFont) throws DocumentException {
        // Create a paragraph for the restaurants section
        Paragraph restaurantHeader = new Paragraph("Your Restaurants\n", boldFont);
        document.add(restaurantHeader);

        // Loop through the restaurants in the schedule event
        for (ScheduleRestaurant scheduleRestaurant : scheduleEvent.getScheduleRestaurants()) {
            // Extract restaurant information
            Restaurant restaurant = scheduleRestaurant.getRestaurant();
            String date = scheduleRestaurant.getDate().toString(); // Assuming date is stored in ScheduleRestaurant
            String meal = scheduleRestaurant.getMeal(); // Assuming meal is stored in ScheduleRestaurant

            // Create a table with 2 columns
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100); // Set table width to 100%

            // Create a cell for the text information
            StringBuilder restaurantText = new StringBuilder();
            restaurantText.append("Date: ").append(date).append("\n");
            restaurantText.append("Meal: ").append(meal).append("\n");
            restaurantText.append("Restaurant: ").append(restaurant.getName()).append("\n");
            restaurantText.append("Location: ").append(restaurant.getLocation()).append("\n");
            restaurantText.append("Rating: ").append(restaurant.getRating()).append("\n");

            PdfPCell textCell = new PdfPCell();
            textCell.addElement(new Paragraph(restaurantText.toString(), normalFont));
            textCell.setBorder(PdfPCell.NO_BORDER); // Remove border from text cell

            // Create a cell for the image
            PdfPCell imageCell = new PdfPCell();
            if (restaurant.getImage() != null && !restaurant.getImage().isEmpty()) {
                try {
                    Image img = Image.getInstance(restaurant.getImage());
                    img.scaleToFit(140, 80); // Scale the image if necessary
                    img.setAlignment(Element.ALIGN_MIDDLE); // Align image to the right
                    imageCell.addElement(img);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            imageCell.setBorder(PdfPCell.NO_BORDER); // Remove border from image cell

            // Add cells to the table
            table.addCell(textCell);
            table.addCell(imageCell);

            // Add the table to the document
            document.add(table);
            document.add(new Paragraph("\n")); // Add a blank line between restaurants
        }
    }
    
    //Details from,to etc
    private void addScheduleDetails(Document document, ScheduleEvent scheduleEvent, Font normalFont, Font boldFont) throws DocumentException {
        // Date formatter for converting Date to "YYYY-MM-DD HH:MM"
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm a");

        // Add Start Location (Bold label, normal data)
        Paragraph startLocation = new Paragraph();
        startLocation.add(new Chunk("Start Location: ", boldFont));
        startLocation.add(new Chunk(scheduleEvent.getStartLocation(), normalFont));
        document.add(startLocation);

        // Add End Location (Bold label, normal data)
        Paragraph endLocation = new Paragraph();
        endLocation.add(new Chunk("End Location: ", boldFont));
        endLocation.add(new Chunk(scheduleEvent.getEndLocation(), normalFont));
        document.add(endLocation);

        // Add Start Time (Bold label, normal data, formatted date)
        Paragraph startTime = new Paragraph();
        startTime.add(new Chunk("Start Time: ", boldFont));
        startTime.add(new Chunk(scheduleEvent.getStartTime().format(formatter), normalFont)); // Formatted date
        document.add(startTime);

        // Add End Time (Bold label, normal data, formatted date)
        Paragraph endTime = new Paragraph();
        endTime.add(new Chunk("End Time: ", boldFont));
        endTime.add(new Chunk(scheduleEvent.getEndTime().format(formatter), normalFont)); // Formatted date
        document.add(endTime);

        // Add blank line for spacing
        document.add(new Paragraph(" "));
    }

    //Stops table
    private void addStopsTable(Document document, ScheduleEvent scheduleEvent, Font normalFont) throws DocumentException {
        // Define the number of columns
        PdfPTable table = new PdfPTable(6);  // 6 columns: From, To, Distance, Arrival Time, Departure Time, Waiting Time
        table.setWidthPercentage(100);       // Set table width to 100% of page width
        table.setSpacingBefore(10f);         // Space before the table

        // Set column widths
        table.setWidths(new float[]{2, 2, 1, 2, 2, 1}); // Adjust the column widths as needed

        // Define header row
        table.addCell(new PdfPCell(new Phrase("From", normalFont))).setBackgroundColor(BaseColor.CYAN);
        table.addCell(new PdfPCell(new Phrase("To", normalFont))).setBackgroundColor(BaseColor.CYAN);
        table.addCell(new PdfPCell(new Phrase("Distance (km)", normalFont))).setBackgroundColor(BaseColor.CYAN);
        table.addCell(new PdfPCell(new Phrase("Arrival Time", normalFont))).setBackgroundColor(BaseColor.CYAN);
        table.addCell(new PdfPCell(new Phrase("Departure Time", normalFont))).setBackgroundColor(BaseColor.CYAN);
        table.addCell(new PdfPCell(new Phrase("Waiting Time (mins)", normalFont))).setBackgroundColor(BaseColor.CYAN);

        // DateTimeFormatter to convert Date into YYYY-MM-DD HH:MM
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm a");

        // Iterate over stops and add each stop's details to the table
        scheduleEvent.getStops().forEach(stop -> {
            // Add each stop's details as rows in the table

            table.addCell(new PdfPCell(new Phrase(stop.getFromLocation(), normalFont)));
            table.addCell(new PdfPCell(new Phrase(stop.getToLocation(), normalFont)));
            table.addCell(new PdfPCell(new Phrase(String.valueOf(stop.getDistance()), normalFont)));
            table.addCell(new PdfPCell(new Phrase(stop.getArrivalTime().format(formatter), normalFont)));  // Format date
            table.addCell(new PdfPCell(new Phrase(stop.getDepartureTime().format(formatter), normalFont)));  // Format date
            table.addCell(new PdfPCell(new Phrase(String.valueOf(stop.getWaitingTime()), normalFont)));

        });

        // Add table to the document
        document.add(table);
    }

    private void addFooter(Document document) throws DocumentException {
        LocalDate date = LocalDate.now();

        // Create a phrase for the footer text
        Phrase footerText = new Phrase();

        // Add fancy text
        footerText.add(new Chunk("---------------------------------------- GENERATED BY TOURMATE Pvt(Ltd) -------------------------------\n", FontFactory.getFont(FontFactory.HELVETICA_BOLDOBLIQUE, 10, Font.BOLD)));

        // Add the current date in a smaller font
        footerText.add(new Chunk("Generated on: " + date.format(DateTimeFormatter.ofPattern("MMMM dd, yyyy")), FontFactory.getFont(FontFactory.HELVETICA, 8, Font.ITALIC)));

        // Create a paragraph with the footer text
        Paragraph footer = new Paragraph(footerText);

        // Align footer to the center
        footer.setAlignment(Element.ALIGN_CENTER);
        footer.setPaddingTop(25);

        // Set the footer at the bottom
        footer.setSpacingBefore(0);
        footer.setSpacingAfter(0);
        // Add footer to the document
        document.add(footer);
    }

}
