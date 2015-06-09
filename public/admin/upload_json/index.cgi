#!/usr/bin/perl

use CGI qw( -utf8 );
use File::Temp qw( tempfile );
use strict;
use warnings;

my $cgi = new CGI();

print $cgi->header( -charset => 'utf-8' );
print $cgi->start_html(
    -title => 'Upload new JSON file',
    -style => {
        -src =>
            '//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css',
        -verbatim => '
form > * { display: block; margin: 1em }
'
    }
);
print qq{<div class="container">\n};

if ( !$cgi->param or !$cgi->param('upfile') ) {

    print $cgi->h1('Upload your updated JSON file');
    print $cgi->start_multipart_form();
    print $cgi->filefield( -name => 'upfile' );
    print $cgi->submit();
    print $cgi->end_form;

} else {

    print $cgi->p('Trying to update JSON file...');

    my $upfile = $cgi->param('upfile');
    my $fh     = $cgi->upload('upfile');

    if ( $upfile !~ m/\.json$/ ) {
        print $cgi->h2( { class => 'text-danger' },
                        "Sorry, this doesn't seem to be a JSON file" );
        print $cgi->h3(
                      $cgi->a( { href => $cgi->url }, "Please start over" ) );
    } elsif ( !$fh ) {
        print $cgi->h2( { class => 'text-danger' },
                        "Sorry, can't get file handle to uploaded file" );
        print $cgi->h3(
                      $cgi->a( { href => $cgi->url }, "Please start over" ) );
    } else {
        my ( $temp_fh, $temp_filename ) = tempfile( UNLINK => 1 );

        my $ok = eval {
            my $nBytes   = 0;
            my $totBytes = 0;
            my $buffer   = "";
            binmode($temp_fh);
            while ( $nBytes = read( $upfile, $buffer, 1024 ) ) {
                print $temp_fh $buffer;
                $totBytes += $nBytes;
            }
            close($temp_fh);

            if ( $totBytes < 1024 ) {
                print $cgi->h2( { class => 'text-danger' },
                                "Sorry, the file's too small, or wasn't uploaded correctly"
                );
                print $cgi->h3(
                      $cgi->a( { href => $cgi->url }, "Please start over" ) );
            } else {
                my $basename
                    = '/var/www/html/radiation_dose_calculator/js/data/RadiationDataTables.json';
                unlink "$basename.old.3";
                rename "$basename.old.2", "$basename.old.3";
                rename "$basename.old.1", "$basename.old.2";
                rename $basename, "$basename.old.1";
                rename $temp_filename,
                    $basename || die "Could not rename to main file";
                chmod 0664, $basename;
            }
        };

        if ( $ok and $ok == 11 ) {
            print $cgi->h1("Great! JSON file updated");
            print $cgi->h3('You may close this window');
        } else {
            print $cgi->h1("Sorry, file upload error: $@");
            print $cgi->h3(
                      $cgi->a( { href => $cgi->url }, "Please start over" ) );
        }
    }
}

print qq{</div>\n};
print $cgi->end_html;
