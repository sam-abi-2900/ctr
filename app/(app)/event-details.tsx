import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react-native';
import { format, parseISO } from 'date-fns';
import { colors, typography, spacing, borderRadius, shadows } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

interface Task {
  id: string;
  name: string;
  type: string;
  description: string;
  task_status: string | null;
  image_url: string | null;
  rejection_reason: string | null;
}

interface CheckInStatus {
  checked_in: boolean;
  checked_out: boolean;
  checkin_time: string | null;
  checkout_time: string | null;
}

interface EventCheckInStatus {
  warehouse: CheckInStatus;
  truck: CheckInStatus;
  event: CheckInStatus;
}

export default function EventDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Parse the JSON strings back to objects
  const tasks: Task[] = JSON.parse(params.tasks as string);
  const checkinStatus: EventCheckInStatus = JSON.parse(params.checkinStatus as string);
  const eventDatetime = parseISO(params.eventDatetime as string);

  const getCheckInStatusDisplay = (status: CheckInStatus) => {
    if (status.checked_in && status.checked_out) {
      return { text: 'Completed', color: colors.success };
    } else if (status.checked_in) {
      return { text: 'In Progress', color: colors.secondary };
    } else {
      return { text: 'Not Started', color: colors.text.tertiary };
    }
  };

  const getTaskStatusDisplay = (task: Task) => {
    if (task.task_status === 'completed') {
      return { text: 'Completed', color: colors.success };
    } else if (task.task_status === 'rejected') {
      return { text: 'Rejected', color: colors.danger };
    } else if (task.task_status === 'in_progress') {
      return { text: 'In Progress', color: colors.secondary };
    } else {
      return { text: 'Not Started', color: colors.text.tertiary };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Event Details</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Image 
          source={{ uri: params.imageUrl as string }} 
          style={styles.eventImage}
        />

        <View style={styles.detailsContainer}>
          <Text style={styles.eventTitle}>{params.title}</Text>
          <Text style={styles.eventType}>{params.type}</Text>

          <View style={styles.infoRow}>
            <MapPin size={16} color={colors.text.tertiary} />
            <Text style={styles.infoText}>{params.city}</Text>
          </View>

          <View style={styles.infoRow}>
            <Calendar size={16} color={colors.text.tertiary} />
            <Text style={styles.infoText}>
              {format(eventDatetime, 'EEEE, MMMM d, yyyy')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Clock size={16} color={colors.text.tertiary} />
            <Text style={styles.infoText}>
              {format(eventDatetime, 'h:mm a')}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Check-in Status</Text>
            <View style={styles.checkInStatusContainer}>
              <View style={styles.checkInStatusItem}>
                <Text style={styles.checkInStatusLabel}>Warehouse</Text>
                <View style={styles.checkInStatusValue}>
                  {checkinStatus.warehouse.checked_in ? (
                    <CheckCircle size={16} color={colors.success} />
                  ) : (
                    <AlertCircle size={16} color={colors.text.tertiary} />
                  )}
                  <Text style={[
                    styles.checkInStatusText,
                    { color: getCheckInStatusDisplay(checkinStatus.warehouse).color }
                  ]}>
                    {getCheckInStatusDisplay(checkinStatus.warehouse).text}
                  </Text>
                </View>
              </View>

              <View style={styles.checkInStatusItem}>
                <Text style={styles.checkInStatusLabel}>Truck</Text>
                <View style={styles.checkInStatusValue}>
                  {checkinStatus.truck.checked_in ? (
                    <CheckCircle size={16} color={colors.success} />
                  ) : (
                    <AlertCircle size={16} color={colors.text.tertiary} />
                  )}
                  <Text style={[
                    styles.checkInStatusText,
                    { color: getCheckInStatusDisplay(checkinStatus.truck).color }
                  ]}>
                    {getCheckInStatusDisplay(checkinStatus.truck).text}
                  </Text>
                </View>
              </View>

              <View style={styles.checkInStatusItem}>
                <Text style={styles.checkInStatusLabel}>Event</Text>
                <View style={styles.checkInStatusValue}>
                  {checkinStatus.event.checked_in ? (
                    <CheckCircle size={16} color={colors.success} />
                  ) : (
                    <AlertCircle size={16} color={colors.text.tertiary} />
                  )}
                  <Text style={[
                    styles.checkInStatusText,
                    { color: getCheckInStatusDisplay(checkinStatus.event).color }
                  ]}>
                    {getCheckInStatusDisplay(checkinStatus.event).text}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tasks</Text>
            {tasks.map((task, index) => (
              <View key={task.id} style={styles.taskItem}>
                <View style={styles.taskHeader}>
                  <Text style={styles.taskName}>{task.name}</Text>
                  <View style={styles.taskStatus}>
                    <Text style={[
                      styles.taskStatusText,
                      { color: getTaskStatusDisplay(task).color }
                    ]}>
                      {getTaskStatusDisplay(task).text}
                    </Text>
                  </View>
                </View>
                <Text style={styles.taskDescription}>{task.description}</Text>
                {task.rejection_reason && (
                  <Text style={styles.rejectionReason}>
                    Rejection Reason: {task.rejection_reason}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    paddingTop: spacing.xs,
    backgroundColor: colors.background.primary,
  },
  backButton: {
    marginRight: spacing.md,
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.title1,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
  },
  eventImage: {
    width: '100%',
    height: 250,
  },
  detailsContainer: {
    padding: spacing.lg,
  },
  eventTitle: {
    ...typography.title2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  eventType: {
    ...typography.subhead,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    textTransform: 'capitalize',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoText: {
    ...typography.body,
    color: colors.text.tertiary,
    marginLeft: spacing.sm,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    ...typography.title3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  checkInStatusContainer: {
    backgroundColor: colors.background.new,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.small,
  },
  checkInStatusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  checkInStatusLabel: {
    ...typography.body,
    color: colors.text.primary,
  },
  checkInStatusValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkInStatusText: {
    ...typography.footnote,
    marginLeft: spacing.xs,
  },
  taskItem: {
    backgroundColor: colors.background.new,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  taskName: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
  },
  taskStatus: {
    marginLeft: spacing.sm,
  },
  taskStatusText: {
    ...typography.footnote,
    fontWeight: '600',
  },
  taskDescription: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  rejectionReason: {
    ...typography.footnote,
    color: colors.danger,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
}); 